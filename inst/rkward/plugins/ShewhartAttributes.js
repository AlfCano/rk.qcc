// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};

        var df = '';
        var raw_col = '';

        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
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
        cmd = "qcc::qcc(data = " + data + ", type = \"" + type + "\"";

        // c-charts don't strictly require sizes if they are 1, but usually good to pass
        if (sizes != "") {
            cmd += ", sizes = " + sizes;
        }

        if (title != "") cmd += ", title = \"" + title + "\"";

        cmd += ")";
    }
  
    if (cmd != "") {
        echo("qcc_preview <- " + cmd + "\n");
    }
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(qcc)){stop(" + i18n("Preview not available, because package qcc is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(qcc)\n");
	}
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};

        var df = '';
        var raw_col = '';

        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
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
        cmd = "qcc::qcc(data = " + data + ", type = \"" + type + "\"";

        // c-charts don't strictly require sizes if they are 1, but usually good to pass
        if (sizes != "") {
            cmd += ", sizes = " + sizes;
        }

        if (title != "") cmd += ", title = \"" + title + "\"";

        cmd += ")";
    }
  
    if (cmd != "") {
        echo("qcc_attr_object <- " + cmd + "\n");
    }
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Shewhart Attributes results")).print();	
	}
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};

        var df = '';
        var raw_col = '';

        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        return { df: df, raw_col: raw_col };
    }
  
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
        cmd = "qcc::qcc(data = " + data + ", type = \"" + type + "\"";

        // c-charts don't strictly require sizes if they are 1, but usually good to pass
        if (sizes != "") {
            cmd += ", sizes = " + sizes;
        }

        if (title != "") cmd += ", title = \"" + title + "\"";

        cmd += ")";
    }
  
    if (cmd != "") {
        echo("rk.header(\"Attribute Chart (" + type + ")\", level=3);\n");
        echo("rk.graph.on()\n");
        echo("print(" + cmd + ")\n");
        echo("rk.graph.off()\n");
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var attrSaveObj = getValue("attr_save_obj");
		var attrSaveObjActive = getValue("attr_save_obj.active");
		var attrSaveObjParent = getValue("attr_save_obj.parent");
		// assign object to chosen environment
		if(attrSaveObjActive) {
			echo(".GlobalEnv$" + attrSaveObj + " <- qcc_attr_object\n");
		}	
	}

}

