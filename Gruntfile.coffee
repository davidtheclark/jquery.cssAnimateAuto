module.exports = (grunt) ->
  grunt.initConfig

    pkg: grunt.file.readJSON "package.json"

    autoprefixer:
      cssAnimateTest:
        files:
          "test/cssTest.css": "test/cssTest.css"

    connect:
      server:
        options:
          port: 9000
          base: "./"

    copy:
      dist:
        files:
          "dist/jquery.cssAnimateAuto.js": "src/jquery.cssAnimateAuto.js"

    uglify:
      dist:
        files:
          "dist/jquery.cssAnimateAuto.min.js": "src/jquery.cssAnimateAuto.js"

    watch:
      livereload:
        options:
          livereload: true
        files: [
          "test/*"
        ]
      autoprefix:
        files: ["test/cssTestDev.css"]
        tasks: ["autoprefixer:cssAnimateTest"]

    sync:
      manifests:
        options:
          include: ["description"]
          alt: "cssAnimateAuto.jquery.json"


  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-autoprefixer"
  grunt.loadNpmTasks "grunt-sync-pkg"

  grunt.registerTask "dev", [
    "connect"
    "watch"
  ]
  grunt.registerTask "build", [
    "copy:dist"
    "uglify:dist"
  ]
