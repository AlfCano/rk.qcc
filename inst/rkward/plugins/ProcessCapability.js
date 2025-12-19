// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
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
        if (auto_break != "1") break_arg = ", breaks = \"scott\""; // Example alternative, though qcc defaults handle it well

        cmd = "qcc::process.capability(object = " + obj + spec_arg + target_arg + ")";
    }
  
    if (cmd != "") {
        echo("print(" + cmd + ")\n");
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
// No save object
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Process Capability results")).print();	
	}
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
        if (auto_break != "1") break_arg = ", breaks = \"scott\""; // Example alternative, though qcc defaults handle it well

        cmd = "qcc::process.capability(object = " + obj + spec_arg + target_arg + ")";
    }
  
    if (cmd != "") {
        echo("rk.header(\"Process Capability Analysis\", level=3);\n");
        echo("rk.graph.on()\n");
        echo("print(" + cmd + ")\n");
        echo("rk.graph.off()\n");
    }
  

}

