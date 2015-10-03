module.exports = function(grunt) {

	grunt.initConfig({
		clean:{
			all: ['www/*.*','src/build/*.*'],
		},
		concat: {
			js: {
				src:['src/js/*.js'],
				dest:'src/build/app.js'
			},
			css: {
				src:['src/css/*.css'],
				dest:'www/app.css'
			},
			html: {
				src:'src/index.html',
				dest:'www/index.html'
			}
		},
		ngmin: {
			js: {
				src: 'src/build/app.js',
				dest: 'www/app.min.js'
			}
		},
		watch: {
			scripts: {
				files: ['src/**/*.*'],
				exclude: 'src/build/*.*',
				tasks: ['clean','concat','ngmin'],
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ngmin');

	grunt.registerTask('default', ['clean','concat','ngmin','watch']);

};