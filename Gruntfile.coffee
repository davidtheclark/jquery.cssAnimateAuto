module.exports = (grunt) ->

  require("load-grunt-tasks")(grunt)

  grunt.initConfig

    srcJs: "src/jquery.cssAnimateAuto.js"

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

    uglify:
      dist:
        options:
          banner: "/*<%= grunt.util.linefeed %>* jquery.cssAnimateAuto - https://github.com/davidtheclark/jquery.cssAnimateAuto<%= grunt.util.linefeed %>* Copyright <%= grunt.template.today('yyyy') %>, David Clark<%= grunt.util.linefeed %>* Released under the MIT license, <%= grunt.template.today('isoDateTime') %><%= grunt.util.linefeed %>*/<%= grunt.util.linefeed %>"
        files:
          "dist/jquery.cssAnimateAuto.min.js": "<%= srcJs %>"

    concat:
      dist:
        options:
          banner: "<%= uglify.dist.options.banner %>"
        files:
          "dist/jquery.cssAnimateAuto.js": "<%= srcJs %>"

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
      options:
        include: ["description"]
        alt: "jquery.cssAnimateAuto.jquery.json"


  # tasks loaded via load-grunt-tasks

  grunt.registerTask "dev", [
    "connect"
    "watch"
  ]
  grunt.registerTask "build", [
    "concat:dist"
    "uglify:dist"
  ]
