var jsFiles = [
  'modernizr/modernizr.js',
  'jquery/jquery.js',
];

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      styleguide: {
        options: {
          compress: false,
          sourceMap: true
        },
        files: {
          'site/css/library.css'  : 'src/less/library.less'
        }
      },
      skins: {
        options: {
          compress: false,
          sourceMap: true
        },
        files: [{
          expand: true,       // Enable dynamic expansion.
          cwd: 'src/less/skin',      // Src matches are relative to this path.
          src: ['**/style-*.less',],  // Actual pattern(s) to match.
          dest: 'src/css/',   // Destination path prefix.
          ext: '.css'   // Dest filepaths will have this extension.
        }]
      },
    },

    cssmin: {
      compress: {
        files: [{
          expand  : true,
          cwd     : 'dist/css/',
          src     : ['*.css'],
          dest    : 'dist/css/',
          ext     : '.min.css'
        }]
      }
    },

    csslint: {
      options: {
        formatters: [{
          id: 'compact',
          dest: 'report/csslint.txt'
        }]
      },
      strict: {
        options: {
          'import': 2,
          'box-model': false,
          'zero-units': false,
          'important': false,
          'adjoining-classes': false,
          'compatible-vendor-prefixes': false
        },
        src: ['dist/css/*.min.css']
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 3 version','ie 9', 'ie 8', 'ie 7']
      },
      files: {
        expand: true,
        src: ['src/css/**/*.css'], // Only do unminified files
        dest: './'
      }
    },

    styleguide: {
      options: {
        framework: {
          name: 'kss'
        },
        template: {
          src: 'src/styleguide-template'
        }
      },
      library: {
        files: [{
          'site/styleguide': 'src/less/library.less'
        }]
      },
      production: {
        files: [{
          'dist/styleguide': 'src/less/library.less',
        }]
      }
    },

    validation: {
      options: {
        reset: grunt.option('reset') || false,
        stoponerror: false,
        relaxerror: [] //ignores these errors
      },
      files: {
        src: ['site/**/*.html']
      }
    },

    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/js/', src: ['**'], dest: 'site/scripts'}
          // {expand: true, cwd: 'src/html/', src: ['**'], dest: 'site/'},
          // {expand: true, cwd: 'src/', src: ['images/**', 'fonts/**'], dest: 'site/'},
          // {expand: true, flatten: true, filter: 'isFile', cwd: 'src/', src: ['css/**'], dest: 'site/css'},
          // {expand: true, flatten: true, cwd: 'bower_components/', src:  jsFiles, dest: 'site/js/'}
        ]
      },
      dist: {
        //TODO: Add things to dist file from src using copy
      }
    },

    jshint: {
      options: {
        asi: false
      },
      check: [
        'src/js/**/*.js'
      ]
    },

    connect: {
      server: {
        options: {
          livereload: 35900,
          port: 9015,
          base: 'site',
          open: {
            target: 'http://localhost:<%= connect.server.options.port %>' // target url to open
          }
        }
      }
    },

    watch: {
      options: {
        livereload: 35900,
        interrupt: true
      },
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less:styleguide', 'less:skins', 'autoprefixer', 'copy:main', 'styleguide:library'],
        options: {
          spawn: false,
          interupt: true,
        }
      },

      js: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
          interupt: true
        }
      },
    }
  });

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('test',        ['less', 'styleguide']);
  grunt.registerTask('server',      ['less', 'autoprefixer', 'copy', 'styleguide:library', 'connect', 'watch']);
  grunt.registerTask('default',     ['less']);
  grunt.registerTask('production',  ['csso', 'styleguide']);



};