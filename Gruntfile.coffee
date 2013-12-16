module.exports = (grunt) ->
  grunt.initConfig

    pkg: grunt.file.readJSON "package.json"

    autoprefixer:
      cssAnimateTest:
        files:
          "test/cssTestDist.css": "test/cssTestDev.css"

    connect:
      server:
        options:
          port: 9000
          base: "./"

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


  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-autoprefixer"

  grunt.registerTask "dev", [
    "connect"
    "watch"
  ]