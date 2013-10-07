module.exports = function(grunt) {

  var SRC_DIR = 'app/',
    REPORTS_DIR = 'reports/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        jshintignore: '.jshintignore'
      },
      jenkins: {
        options: {
          globals: {
            module: true,
            setTimeout: true,
            localStorage: true
          },
          reporter: 'jslint',
          reporterOutput: REPORTS_DIR + 'jshint.xml',
          force: true
        },
        files: {
          src: [SRC_DIR + '**/*.js']
        }
      },
      core: {
        options: {
          globals: {
            module: true,
            setTimeout: true,
            localStorage: true
          }
        },
        files: {
          src: [SRC_DIR + '**/*.js']
        }
      },
      gruntfile: {
        options: {
          node: true
        },
        files: {
          src: ['Gruntfile.js']
        }
      }
    },

    gjslint: {
      options: {
        reporter: {
          name: 'console'
        },
        flags: [
          '--max_line_length 120',
          '--exclude_directories "reports,app/.meteor,app/client/compatibility,app/client/lib/js/ext,node_modules"',
          '--exclude_files "Gruntfile.js"'
        ],
        force: false
      },
      jenkins: {
        options: {
          reporter: {
            name: 'gjslint_xml',
            dest: REPORTS_DIR + 'gjslint.xml'
          }
        },
        src: [SRC_DIR + '**/*.js']
      },
      core: {
        src: [SRC_DIR + '**/*.js']
      }
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },
      core: {
        files: [SRC_DIR + '**/*.js'],
        tasks: ['jshint:core', 'gjslint:core']
      }
    },

    exec: {
      run: {
        cwd: SRC_DIR,
        cmd: 'meteor'
      }
    },

    plato: {
      options: {
        jshint: grunt.file.readJSON('.jshintrc'),
        exclude: (function() {
          var ignore = grunt.file.read('.jshintignore'),
            files = ignore.split('\n'),
            regex = '',
            file;

          for (var i = 0, len = files.length; i < len; i++) {
            file = files[i];
            file = file.replace('/', '\\/').replace('.', '\\.').replace('*', '\\*');
            regex += file + '|';
          }

          regex = regex.substr(0, regex.length - 2);
          return new RegExp(regex);
        })()
      },
      core: {
        files: {
          'reports/plato': [SRC_DIR + '**/*.js']
        }
      }
    },

    clean: {
      reports: [REPORTS_DIR]
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-devtools');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [
    'jshint:core','gjslint:core'
  ]);

  grunt.registerTask('preview', [
    'exec:run'
  ]);

  grunt.registerTask('reports', [
    'jshint:jenkins', 'gjslint:jenkins', 'plato:core'
  ]);
};
