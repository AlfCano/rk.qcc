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

        cmd = "qcc::qcc(data = " + data_arg + ", type = \"" + type + "\"";

        if (title != "") cmd += ", title = \"" + title + "\"";
        if (xlab != "") cmd += ", xlab = \"" + xlab + "\"";

        cmd += ")";
    }
  
    if (cmd != "") {
        echo("qcc_preview <- " + cmd + "\n");
        // qcc automatically plots when created or printed
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

        cmd = "qcc::qcc(data = " + data_arg + ", type = \"" + type + "\"";

        if (title != "") cmd += ", title = \"" + title + "\"";
        if (xlab != "") cmd += ", xlab = \"" + xlab + "\"";

        cmd += ")";
    }
  
    if (cmd != "") {
        echo("qcc_object <- " + cmd + "\n");
    }
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Shewhart Charts (Continuous) results")).print();	
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

        cmd = "qcc::qcc(data = " + data_arg + ", type = \"" + type + "\"";

        if (title != "") cmd += ", title = \"" + title + "\"";
        if (xlab != "") cmd += ", xlab = \"" + xlab + "\"";

        cmd += ")";
    }
  
    if (cmd != "") {
        echo("rk.header(\"Shewhart Chart (" + type + ")\", level=3);\n");
        echo("rk.graph.on()\n");
        echo("print(" + cmd + ")\n");
        echo("rk.graph.off()\n");
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var contSaveObj = getValue("cont_save_obj");
		var contSaveObjActive = getValue("cont_save_obj.active");
		var contSaveObjParent = getValue("cont_save_obj.parent");
		// assign object to chosen environment
		if(contSaveObjActive) {
			echo(".GlobalEnv$" + contSaveObj + " <- qcc_object\n");
		}	
	}

}

