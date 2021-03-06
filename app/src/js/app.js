var app = angular.module('fenceProject',[]);

var mainCtrl = app.controller('mainCtrl',['$scope','api', function ($scope, api) {
	window.debug = $scope;
	$scope.api = api;

	//Set up
	var drawLayer = document.getElementById("layer1");
	var saveLayer = document.getElementById("layer2");
	var gridLayer = document.getElementById("layer3");

	var draw = drawLayer.getContext("2d");
	var save = saveLayer.getContext("2d");
	var grid = gridLayer.getContext("2d");

	//Determine size of canvas
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	if (w < 800) {
		$scope.small = true;
	}
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	draw.canvas.width = w * .75; //offset - just trial and error
	draw.canvas.height = h*.75;	
	save.canvas.width = draw.canvas.width;
	save.canvas.height = draw.canvas.height;
	grid.canvas.width = draw.canvas.width;
	grid.canvas.height = draw.canvas.height;

	$scope.canvasHeight = draw.canvas.height;

	//The good stuff
	$scope.allow = true;
	$scope.sections = [];

	var line = {start:null, mid:null, end:null, length:null, gate: false, showDialog: true};
	$scope.handleClick = function(e) {
		if (!$scope.allow)
			return;

		e.preventDefault();
		var pos = $scope.resources.getClickPos(e);
		var snap = $scope.resources.snap(pos);
		if (snap != -1) {
			pos = snap;
		}

		if (!line.start) {
			line.start = pos;
		}
		else {
			line.end = pos;
			line.mid = $scope.resources.getMidPts(line);

			if ($scope.sections.length >= 1)
				line.length = $scope.length;
			//Don't draw lines that are smaller than 10 px
			if (!(Math.sqrt(Math.pow((line.end.x - line.start.x),2) + Math.pow((line.end.y - line.start.y),2)) < 10)) {
				$scope.sections.push(line);
				$scope.allow = false;

				draw.clearRect(0, 0, drawLayer.width, drawLayer.height);
				$scope.resources.draw(line, save, '#000000');
			}

			line = {start:null, mid:null, end:null, length:null, gate: false, showDialog: true};
		}
	};

	$scope.scale = 1;
	$scope.dist = 0;
	$scope.length = 0;
	function distance(start, end) {
		return Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
	}

	$scope.handleMove = function(e) {
		e.preventDefault();
		draw.clearRect(0, 0, drawLayer.width, drawLayer.height);
		if (line.start) {
			line.end = $scope.resources.getClickPos(e);
			$scope.resources.draw(line, draw, '#000000');

			//Scaling stuff
			line.mid = $scope.resources.getMidPts(line);
			$scope.dist = distance(line.start, line.end);
			$scope.length = Math.round($scope.dist * $scope.scale);
			if ($scope.sections.length >= 1)
				$scope.resources.drawText(line, $scope.length, false, draw);
		}
		var snap = $scope.resources.snap($scope.resources.getClickPos(e));
		if (snap != -1) {
			$scope.resources.drawSnap(snap);
		}

		//New feature draw dotted line when x or y match
		//$scope.resources.checkGrid
	};

	$scope.error = false;
	$scope.errorMsg;
	$scope.removeDialog = function(index, length, gate) {
		if (length > 10 && gate) {
			$scope.errorMsg = "Gate length must be less than 10";
			$scope.error = true;
			return;
		}

		if (length < 0) {
			$scope.errorMsg = "Only positive numbers are valid";
			$scope.error = true;
			return;
		}
		
		$scope.sections[index].showDialog = false;
		$scope.resources.drawText($scope.sections[index], $scope.sections[index].length);
		$scope.error = false;
		$scope.allow = true;

		// var obj = {};
		// angular.copy($scope.sections[index], obj);
		// $scope.scaledSections.push(obj);
		if ($scope.sections.length == 1)
			$scope.scale = length / $scope.dist;
	};

	$scope.resources = {
		getClickPos: function(e) {
			var canvas = drawLayer.getBoundingClientRect();

			//Offset based on canvas position
			x = e.clientX - canvas.left;
			y = e.clientY - canvas.top;
			return {x: x, y: y};
		},
		snap: function(pos) {
			if ($scope.sections && $scope.sections.length > 0) {
				for (var i in $scope.sections) {
					if (Math.abs($scope.sections[i].start.x - pos.x) <= 10 && 
						Math.abs($scope.sections[i].start.y - pos.y) <= 10) {
							return $scope.sections[i].start;
					} else if (Math.abs($scope.sections[i].end.x - pos.x) <= 10 &&
						Math.abs($scope.sections[i].end.y - pos.y) <= 10) {
							return $scope.sections[i].end;
					} else if (Math.abs($scope.sections[i].mid.x - pos.x) <= 10 &&
						Math.abs($scope.sections[i].mid.y - pos.y) <= 10) {
							return $scope.sections[i].mid;
					}
				}
			}
			return -1;
		},
		drawSnap: function(pos) {
			draw.beginPath();
			draw.lineWidth = 1;
			draw.arc(pos.x,pos.y,10,0,2*Math.PI);
			draw.stroke();
		},
		drawGrid: function(save) {
			var h = save.canvas.height;
			var w = save.canvas.width;
			for (var i = 0; i < save.canvas.height; i=i+10) {
				$scope.resources.draw({start:{x:0,y:i},end:{x:w,y:i}},save, '#f1f1f1',1);
			}
			for (var i = 0; i < save.canvas.width; i=i+10) {
				$scope.resources.draw({start:{x:i,y:0},end:{x:i,y:h}},save, '#f1f1f1',1);
			}
		},
		getMidPts: function(line) {
			var x = line.end.x - line.start.x;
			x = x/2;
			x = line.start.x + x;

			var y = line.end.y - line.start.y;
			y = y/2;
			y = line.start.y + y;	

			return {x: x, y: y};
		},
		draw: function(line, layer, color, width) {
			layer.strokeStyle = color;
			layer.lineWidth = (width)?width:3;
			layer.beginPath();
			layer.moveTo(line.start.x,line.start.y);
			layer.lineTo(line.end.x,line.end.y);
			layer.stroke();
		},
		undo: function() {
			if ($scope.sections.length > 0) {
				var section = $scope.sections.pop();
				$scope.resources.draw(section, save, '#ffffff',2);
				$scope.resources.drawText(section, null, true);
			}
		},
		drawText: function(line, value, erase, layer) {
			var x;
			var y;

			var s = (line.end.y - line.start.y)/(line.end.x - line.start.x);
			var pos = line.mid;

			if (s < 0 && s > -30) {
				x = pos.x + 5;
				y = pos.y + 5;
			}
			else if (s > 0 && s < 30) {
				x = pos.x - 5;
				y = pos.y - 5;
			}
			else if (s == 0) {
				x = pos.x;
				y = pos.y - 5;
			}
			else if (Math.abs(s) > 30 || s == Number.POSITIVE_INFINITY || s == Number.NEGATIVE_INFINITY) {
				x = pos.x + 3;
				y = pos.y;
			}

			if (erase){
				save.strokeStyle = '#FFFFFF';
				save.beginPath();
				save.arc(x,y,10,0,2*Math.PI);
				save.fillStyle = '#FFFFFF';
				save.fill();
				save.stroke();
			} else {
	        	if (layer)
	        		layer.fillText(Number(value), x, y);
	        	else 
	        		save.fillText(Number(value), x, y);
	        }
		},
		submitCanvas: function() {
			window.location.href = '#discover';
			if ($scope.sections.length > 0) {
				$scope.resources.submitted = true;
			}
			if ($scope.selected) {
				$scope.calculateMaterials();
			}
		},
		clearCanvas: function() {
			draw.clearRect(0, 0, drawLayer.width, drawLayer.height);
			save.clearRect(0, 0, drawLayer.width, drawLayer.height);
			line = {start:null, mid:null, end:null, length:null, gate: false, showDialog: true};
			$scope.sections.length = 0;
			//$scope.resources.drawGrid(save);
		},
		submitted: false
	};

	//Selecting
	$scope.selected;
	$scope.selectedStyle;
	$scope.selectedHeight = {};
	$scope.selectedColor;

	$scope.select = function(data) {
		$scope.selected = data;

		$scope.selectedColor = (data.colors.length > 0)?data.colors[0]:null;
		$scope.selectedStyle = (data.styles.length > 0)?data.styles[0]:null;
		$scope.selectedHeight = (data.sizes.length > 0)?data.sizes[1]:null;
	}
	
	$scope.selectColor = function(color) {
		$scope.selectedColor = color;
	}

	$scope.selectHeight = function(height) {
		$scope.selectedHeight = height;
	}
	
	$scope.selectStyle = function(style) {
		$scope.selectedStyle = style;
	}

	$scope.materials = {};

	$scope.$watch('selected', function(newValue, oldValue) {
		if (newValue) {
			$scope.materials.components = newValue.sectionComponents;
			//$scope.materials.gates = newValue.gate;
			if ($scope.resources.submitted) {
				$scope.calculateMaterials();
			}
		}
	});

	$scope.calculateMaterials = function() {
		var posts = [];
		var lgates = 0;
		var sgates = 0;
		var sectLen = $scope.selectedHeight.length;
		var fenceSects = 0;
		var postLen = 0;
		var totalLen = 0;
		var remainder = 0;

		for (var i in $scope.sections) {
			if (posts.indexOf($scope.sections[i].start) == -1) {
				posts.push($scope.sections[i].start);
			}
			if (posts.indexOf($scope.sections[i].end) == -1) {
				posts.push($scope.sections[i].end);
			}

			if ($scope.sections[i].gate) {
				if (Number($scope.sections[i].length) <= 4)
					sgates++;
				else
					lgates++;
			}
			else {
				totalLen += Number($scope.sections[i].length);

				//remainder += Number($scope.sections[i].length % sectLen);
				fenceSects += Math.ceil(Number($scope.sections[i].length / sectLen));
				
				postLen += Math.ceil(Number($scope.sections[i].length / sectLen) - 1)
			}
		}

		$scope.materials.posts = posts.length + postLen;
		$scope.materials.sections = fenceSects; //+ Math.ceil(remainder/sectLen);
		$scope.materials.totalLength = totalLen;

		for (var k in $scope.materials.components) {
			if ($scope.materials.components[k].name == '6\' Pickets') {
				if (Number($scope.selectedHeight.name.substr(0,1)) == 3)
					$scope.materials.components[k].value = Math.ceil($scope.selected.ppf * totalLen / 2);
				else
					$scope.materials.components[k].value = Math.ceil($scope.selected.ppf * totalLen);
			}
			else
				$scope.materials.components[k].value *= $scope.materials.sections;
		}
		
		$scope.materials.gates = [];
		if (lgates > 0) {
			for (var j in $scope.selected.gate.large) {
				$scope.materials.gates.push({name:$scope.selected.gate.large[j].name, value:$scope.selected.gate.large[j].value * lgates});
			}
		} else if (sgates > 0) {
			for (var j in $scope.selected.gate.small) {
				$scope.materials.gates.push({name:$scope.selected.gate.small[j].name, value:$scope.selected.gate.small[j].value * sgates});
			}
		}

		window.location.href = '#discover';
	};

	$scope.resources.drawGrid(grid);
}]);