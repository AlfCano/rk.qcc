local({
  # =========================================================================================
  # 1. Package Definition and Metadata
  # =========================================================================================
  require(rkwarddev)
  rkwarddev.required("0.10-3")

  package_about <- rk.XML.about(
    name = "rk.qcc",
    author = person(
      given = "Alfonso",
      family = "Cano",
      email = "alfonso.cano@correo.buap.mx",
      role = c("aut", "cre")
    ),
    about = list(
      desc = "An RKWard plugin package for Quality Control Charts and Capability Analysis using the 'qcc' library.",
      version = "0.0.1",
      url = "https://github.com/AlfCano/rk.qcc",
      license = "GPL (>= 3)"
    )
  )

  # Menu Hierarchy
  common_hierarchy <- list("analysis", "Quality Control (qcc)")

  # =========================================================================================
  # 2. JS Helper
  # =========================================================================================
  js_parse_helper <- "
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};

        var df = '';
        var raw_col = '';

        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/[\"']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  "

  # =========================================================================================
  # COMPONENT 1: Continuous Charts (Shewhart)
  # =========================================================================================

  help_cont <- rk.rkh.doc(
    title = rk.rkh.title(text = "Shewhart Charts (Continuous)"),
    summary = rk.rkh.summary(text = "Create control charts for continuous variables (X-bar, R, S, Individuals)."),
    usage = rk.rkh.usage(text = "Select the data variable. If data is a single column, select a grouping variable to define samples. If data is a matrix (rows=samples), leave grouping empty.")
  )

  cont_selector <- rk.XML.varselector(id.name = "cont_selector")

  cont_data <- rk.XML.varslot(label = "Data Variable (Vector or Matrix)", source = "cont_selector", required = TRUE, id.name = "cont_data")
  cont_group <- rk.XML.varslot(label = "Grouping Variable (for Vectors)", source = "cont_selector", id.name = "cont_group")

  cont_type <- rk.XML.dropdown(label = "Chart Type", options = list(
      "xbar (Mean)" = list(val = "xbar", chk = TRUE),
      "R (Range)" = list(val = "R"),
      "S (Standard Deviation)" = list(val = "S"),
      "xbar.one (Individuals)" = list(val = "xbar.one")
  ), id.name = "cont_type")

  cont_title <- rk.XML.input(label = "Chart Title", id.name = "cont_title")
  cont_xlab <- rk.XML.input(label = "X Label", id.name = "cont_xlab")

  cont_save <- rk.XML.saveobj(label = "Save QCC Object as", chk = TRUE, initial = "qcc_object", id.name = "cont_save_obj")
  cont_preview <- rk.XML.preview(mode = "plot")

  dialog_cont <- rk.XML.dialog(
    label = "Shewhart Charts (Continuous)",
    child = rk.XML.row(
        cont_selector,
        rk.XML.col(
            cont_data,
            cont_group,
            rk.XML.frame(cont_type, cont_title, cont_xlab, label = "Settings"),
            cont_save,
            cont_preview
        )
    )
  )

  js_body_cont <- paste0(js_parse_helper, '
    var data = getValue("cont_data");
    var group = getValue("cont_group");
    var type = getValue("cont_type");
    var title = getValue("cont_title");
    var xlab = getValue("cont_xlab");

    var cmd = "";

    if (data != "") {
        var data_arg = data;

        // If grouping is provided, transform vector to matrix using qcc.groups
        if (group != "") {
            data_arg = "qcc::qcc.groups(" + data + ", " + group + ")";
        }

        cmd = "qcc::qcc(data = " + data_arg + ", type = \\\"" + type + "\\\"";

        if (title != "") cmd += ", title = \\\"" + title + "\\\"";
        if (xlab != "") cmd += ", xlab = \\\"" + xlab + "\\\"";

        cmd += ")";
    }
  ')

  js_calc_cont <- paste0(js_body_cont, '
    if (cmd != "") {
        echo("qcc_object <- " + cmd + "\\n");
    }
  ')

  js_print_cont <- paste0(js_body_cont, '
    if (cmd != "") {
        echo("rk.header(\\"Shewhart Chart (" + type + ")\\", level=3);\\n");
        echo("rk.graph.on()\\n");
        echo("print(" + cmd + ")\\n");
        echo("rk.graph.off()\\n");
    }
  ')

  # For preview, we generate the object locally and print it
  js_preview_cont <- paste0(js_body_cont, '
    if (cmd != "") {
        echo("qcc_preview <- " + cmd + "\\n");
        // qcc automatically plots when created or printed
    }
  ')

  component_cont <- rk.plugin.component(
    "ShewhartContinuous",
    xml = list(dialog = dialog_cont),
    js = list(require="qcc", calculate = js_calc_cont, preview = js_preview_cont, printout = js_print_cont),
    hierarchy = common_hierarchy,
    rkh = list(help = help_cont)
  )

  # =========================================================================================
  # COMPONENT 2: Attribute Charts
  # =========================================================================================

  help_attr <- rk.rkh.doc(
    title = rk.rkh.title(text = "Attribute Charts"),
    summary = rk.rkh.summary(text = "Create control charts for attribute data (Counts of defects or defectives)."),
    usage = rk.rkh.usage(text = "Select the variable containing counts. Specify sample sizes (variable or constant).")
  )

  attr_selector <- rk.XML.varselector(id.name = "attr_selector")

  attr_data <- rk.XML.varslot(label = "Count Variable (Defects/Defectives)", source = "attr_selector", required = TRUE, id.name = "attr_data")

  attr_size_mode <- rk.XML.radio(label = "Sample Size Source", options = list(
      "Variable" = list(val = "var", chk = TRUE),
      "Constant" = list(val = "const")
  ), id.name = "attr_size_mode")

  attr_size_var <- rk.XML.varslot(label = "Sample Size Variable", source = "attr_selector", id.name = "attr_size_var")
  attr_size_const <- rk.XML.input(label = "Constant Sample Size", initial = "50", id.name = "attr_size_const")

  attr_type <- rk.XML.dropdown(label = "Chart Type", options = list(
      "p (Proportion)" = list(val = "p", chk = TRUE),
      "np (Count of Defectives)" = list(val = "np"),
      "c (Count of Defects)" = list(val = "c"),
      "u (Rate of Defects)" = list(val = "u")
  ), id.name = "attr_type")

  attr_title <- rk.XML.input(label = "Chart Title", id.name = "attr_title")

  attr_save <- rk.XML.saveobj(label = "Save QCC Object as", chk = TRUE, initial = "qcc_attr_object", id.name = "attr_save_obj")
  attr_preview <- rk.XML.preview(mode = "plot")

  dialog_attr <- rk.XML.dialog(
    label = "Attribute Charts",
    child = rk.XML.row(
        attr_selector,
        rk.XML.col(
            attr_data,
            rk.XML.frame(attr_size_mode, attr_size_var, attr_size_const, label = "Sample Sizes"),
            attr_type,
            attr_title,
            attr_save,
            attr_preview
        )
    )
  )

  js_body_attr <- paste0(js_parse_helper, '
    var data = getValue("attr_data");
    var size_mode = getValue("attr_size_mode");
    var size_var = getValue("attr_size_var");
    var size_const = getValue("attr_size_const");
    var type = getValue("attr_type");
    var title = getValue("attr_title");

    var cmd = "";
    var sizes = "";

    if (size_mode == "var") {
        if (size_var != "") sizes = size_var;
    } else {
        sizes = size_const;
    }

    if (data != "") {
        cmd = "qcc::qcc(data = " + data + ", type = \\\"" + type + "\\\"";

        // c-charts don\'t strictly require sizes if they are 1, but usually good to pass
        if (sizes != "") {
            cmd += ", sizes = " + sizes;
        }

        if (title != "") cmd += ", title = \\\"" + title + "\\\"";

        cmd += ")";
    }
  ')

  js_calc_attr <- paste0(js_body_attr, '
    if (cmd != "") {
        echo("qcc_attr_object <- " + cmd + "\\n");
    }
  ')

  js_print_attr <- paste0(js_body_attr, '
    if (cmd != "") {
        echo("rk.header(\\"Attribute Chart (" + type + ")\\", level=3);\\n");
        echo("rk.graph.on()\\n");
        echo("print(" + cmd + ")\\n");
        echo("rk.graph.off()\\n");
    }
  ')

  js_preview_attr <- paste0(js_body_attr, '
    if (cmd != "") {
        echo("qcc_preview <- " + cmd + "\\n");
    }
  ')

  component_attr <- rk.plugin.component(
    "Shewhart Attributes",
    xml = list(dialog = dialog_attr),
    js = list(require="qcc", calculate = js_calc_attr, preview = js_preview_attr, printout = js_print_attr),
    hierarchy = common_hierarchy,
    rkh = list(help = help_attr)
  )

  # =========================================================================================
  # COMPONENT 3: Process Capability
  # =========================================================================================

  help_cap <- rk.rkh.doc(
    title = rk.rkh.title(text = "Process Capability Analysis"),
    summary = rk.rkh.summary(text = "Calculate Cp and Cpk indices and generate a histogram with specification limits."),
    usage = rk.rkh.usage(text = "Select a saved 'qcc' object (must be continuous data, e.g., xbar). Define Lower and/or Upper specification limits.")
  )

  cap_selector <- rk.XML.varselector(id.name = "cap_selector")

  # Filter for qcc objects
  cap_obj <- rk.XML.varslot(label = "Select QCC Object", source = "cap_selector", classes = "qcc", required = TRUE, id.name = "cap_obj")

  cap_specs <- rk.XML.frame(
      rk.XML.input(label = "Lower Spec Limit (LSL)", id.name = "cap_lsl"),
      rk.XML.input(label = "Upper Spec Limit (USL)", id.name = "cap_usl"),
      rk.XML.input(label = "Target Value (Optional)", id.name = "cap_target"),
      label = "Specifications"
  )

  cap_break <- rk.XML.cbox(label = "Automatic Breaks", value = "1", chk = TRUE, id.name = "cap_auto_break")

  cap_preview <- rk.XML.preview(mode = "plot")

  dialog_cap <- rk.XML.dialog(
    label = "Process Capability",
    child = rk.XML.row(
        cap_selector,
        rk.XML.col(
            cap_obj,
            cap_specs,
            cap_break,
            cap_preview
        )
    )
  )

  js_body_cap <- '
    var obj = getValue("cap_obj");
    var lsl = getValue("cap_lsl");
    var usl = getValue("cap_usl");
    var target = getValue("cap_target");
    var auto_break = getValue("cap_auto_break");

    var cmd = "";
    var specs = [];

    if (obj != "") {
        if (lsl != "") specs.push("LSL = " + lsl);
        if (usl != "") specs.push("USL = " + usl);

        var spec_arg = "";
        if (specs.length > 0) {
            spec_arg = ", spec.limits = c(" + specs.join(", ") + ")";
        }

        var target_arg = "";
        if (target != "") target_arg = ", target = " + target;

        var break_arg = "";
        if (auto_break != "1") break_arg = ", breaks = \\\"scott\\\""; // Example alternative, though qcc defaults handle it well

        cmd = "qcc::process.capability(object = " + obj + spec_arg + target_arg + ")";
    }
  '

  # Capability doesn't usually return a reusable object to save, it prints/plots
  js_calc_cap <- '// No save object'

  js_print_cap <- paste0(js_body_cap, '
    if (cmd != "") {
        echo("rk.header(\\"Process Capability Analysis\\", level=3);\\n");
        echo("rk.graph.on()\\n");
        echo("print(" + cmd + ")\\n");
        echo("rk.graph.off()\\n");
    }
  ')

  js_preview_cap <- paste0(js_body_cap, '
    if (cmd != "") {
        echo("print(" + cmd + ")\\n");
    }
  ')

  component_cap <- rk.plugin.component(
    "Process Capability",
    xml = list(dialog = dialog_cap),
    js = list(require="qcc", calculate = js_calc_cap, preview = js_preview_cap, printout = js_print_cap),
    hierarchy = common_hierarchy,
    rkh = list(help = help_cap)
  )

  # =========================================================================================
  # BUILD SKELETON
  # =========================================================================================

  rk.plugin.skeleton(
    about = package_about,
    path = ".",
    xml = list(dialog = dialog_cont),
    js = list(
        require = "qcc",
        calculate = js_calc_cont,
        printout = js_print_cont,
        preview = js_preview_cont
    ),
    rkh = list(help = help_cont),
    components = list(
        component_attr,
        component_cap
    ),
    pluginmap = list(
        name = "Shewhart Charts (Continuous)",
        hierarchy = common_hierarchy
    ),
    create = c("pmap", "xml", "js", "desc", "rkh"),
    load = TRUE,
    overwrite = TRUE,
    show = FALSE
  )

  cat("\nPlugin package 'rk.qcc' (v0.0.1) generated successfully.\n")
  cat("  1. rk.updatePluginMessages(path=\".\")\n")
  cat("  2. devtools::install(\".\")\n")
})
