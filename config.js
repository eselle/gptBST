var includesPath = 'Areas/BridgeStreet/Assets/Local';
var viewsPath = 'Areas/BridgeStreet/Views';

var config = {

    paths: {
        includes: includesPath,
        views: viewsPath
    },

    watch : {
        src : includesPath + "/Less/**/*.less"
    },         

    browserSync: {
        injectChanges: true,
        files: [includesPath + "/Css/*.css", includesPath + "/Scripts/*.js"],
        debugInfo: false,
        watchTask: true             
    },

    less : {
        src : includesPath + "/Less/main.less", 
        dest : includesPath + "/Css"
    },    
    
    browserify : {
        src: includesPath + "/Scripts/main.js",
        dest: includesPath + "/Scripts",
        outputName: "scripts.js"        
    },

    jsSource : {
        //src: [includesPath + "/Scripts/**/*.js", "!" + includesPath + "/Scripts/scripts.js"]
        src: includesPath + "/Scripts/**/*.js"
    }    

};

module.exports = config;  
