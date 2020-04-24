recalculateServiceTime();
$('.priority-only').hide();
$('.Arrival-time').hide();
$('.Burst-time').hide();
$('.Priority-time').hide();
$('.Factor').hide();
$('.turnAroundTime').show();

$(document).ready(function() {
	$('input[type=radio][name=algorithm]').change(function() {
		if (this.value == 'priority') {
			$('.priority-only').show();
			$('.servtime').show();
			$('#minus').css('left', '745px');
		} else {
			$('.priority-only').hide();
			$('.servtime').show();
			$('#minus').css('left', '565px');
		}

		if (this.value == 'robin') {
			$('.servtime').show();
			$('#quantumParagraph').show();
			$('.turnAroundTime').show();
			$('.Arrival-time').hide();
			$('.Burst-time').hide();
			$('.Priority-time').hide();
			$('.Factor').hide();
		} else if (this.value == 'Best-job-first') {
			$('#minus').css('left', '1340px');
			$('.Arrival-time').show();
			$('.Burst-time').show();
			$('.Priority-time').show();
			$('.Factor').show();
			$('.priority-only').show();
			$('.servtime').show();
			$('.turnAroundTime').show();
			$('td .Factor').show('');
		} else {
			$('#quantumParagraph').hide();
			$('.servtime').show();
			$('.Arrival-time').hide();
			$('.Burst-time').hide();
			$('.Priority-time').hide();
			$('.Factor').hide();
			$('.turnAroundTime').show();
		}

		recalculateServiceTime();
	});
});
var processNumber = 2;
function addRow() {
	var lastRow = $('#inputTable tr:last');
	var lastRowNumebr = parseInt(lastRow.children()[1].innerText);

	if (!document.getElementById('1').checked) {
		lastRowNumebr = -1;
	}

	var newRow =
		'<tr><td>P' +
		processNumber++ +
		'</td><td>' +
		(lastRowNumebr + 1) +
		'</td><td><input class="exectime" type="text"/></td><td class="servtime"></td>' +
		//if ($('input[name=algorithm]:checked', '#algorithm').val() == "priority")
		'<td class="priority-only initial"><input type="text"/></td>' +
		'</td><td class="turnAroundTime"></td>' +
		'</td><td class="Arrival-time initial"><input type="text"/></td>' +
		'</td><td class="Burst-time initial"><input type="text"/></td>' +
		'</td><td class="Priority-time initial"><input type="text"/></td>' +
		'</td><td class="Factor"></td></tr>';

	lastRow.after(newRow);

	var minus = $('#minus');
	minus.show();
	minus.css('top', parseFloat(minus.css('top')) + 24 + 'px');

	if ($('input[name=algorithm]:checked', '#algorithm').val() != 'priority') $('.priority-only').hide();

	if ($('input[name=algorithm]:checked', '#algorithm').val() == 'robin') {
		//$('.servtime').hide();
		// $('.turnAroundTime').hide();
	}

	if ($('input[name=algorithm]:checked', '#algorithm').val() != 'Best-job-first') {
		$('.Arrival-time').hide();
		$('.Burst-time').hide();
		$('.Priority-time').hide();
		$('.Factor').hide();
	} else {
		$('.priority-only').show();
	}

	$('#inputTable tr:last input').change(function() {
		recalculateServiceTime();
	});
}

function deleteRow() {
	var lastRow = $('#inputTable tr:last');
	lastRow.remove();

	var minus = $('#minus');
	minus.css('top', parseFloat(minus.css('top')) - 24 + 'px');

	if (parseFloat(minus.css('top')) < 150) minus.hide();
}

$('.initial').change(function() {
	recalculateServiceTime();
});

function recalculateServiceTime() {
	var inputTable = $('#inputTable tr');
	var totalExectuteTime = 0;
	var tat = 0;

	var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
	if (algorithm == 'fcfs') {
		var exectuteTimes = [];
		$.each(inputTable, function(key, value) {
			//console.log(key,value,$(value.children[2]).children().first().val())

			if (key == 0) return true;
			exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
		});

		var currentIndex = 0;
		for (var i = 0; i < exectuteTimes.length; i++) {
			tat = 0;
			$(inputTable[i + 1].children[1]).text(i);
		}

		var i = 0;
		$.each(inputTable, function(key, value) {
			tat = 0;

			if (key == 0) return true;
			tat = totalExectuteTime + parseInt($(value.children[2]).children().first().val()) - i;
			i++;
			$(value.children[3]).text(totalExectuteTime);
			$(value.children[5]).text(tat);
			var executeTime = parseInt($(value.children[2]).children().first().val());

			totalExectuteTime += executeTime;
		});
	} else if (algorithm == 'sjf') {
		var exectuteTimes = [];
		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
		});

		var currentIndex = -1;
		for (var i = 0; i < exectuteTimes.length; i++) {
			tat = 0;

			currentIndex = findNextIndex(currentIndex, exectuteTimes);

			if (currentIndex == -1) return;

			$(inputTable[i + 1].children[1]).text('0');

			$(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);
			tat = exectuteTimes[currentIndex] + totalExectuteTime;
			$(inputTable[currentIndex + 1].children[5]).text(tat);
			

			totalExectuteTime += exectuteTimes[currentIndex];
		}
	} else if (algorithm == 'priority') {
		var exectuteTimes = [];
		var priorities = [];

		$.each(inputTable, function(key, value) {
			tat = 0;
			if (key == 0) return true;
			exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
			priorities[key - 1] = parseInt($(value.children[4]).children().first().val());
		});

		for (var i = 0; i < exectuteTimes.length; i++) {
			$(inputTable[i + 1].children[1]).text('0');
		}

		var currentIndex = -1;
		for (var i = 0; i < exectuteTimes.length; i++) {
			tat = 0;
			//$(inputTable[i + 2].children[1]).text('0');
			currentIndex = findNextIndexWithPriority(currentIndex, priorities);

			if (currentIndex == -1) return;

			tat = exectuteTimes[currentIndex] + totalExectuteTime;
			$(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);
			$(inputTable[currentIndex + 1].children[5]).text(tat);

			totalExectuteTime += exectuteTimes[currentIndex];
		}
	} else if (algorithm == 'robin') {
		$('#minus').css('left', '570px');

		var exectuteTimes = [];
		var wt = [];
		var bt = [];
		var tat = [];

		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
			bt[key - 1] = parseInt($(value.children[2]).children().first().val());
		});

		for (var i = 0; i < bt.length; i++) {
			wt[i] = 0;
			tat[i] = 0;
			$(inputTable[i + 1].children[1]).text(0);
		}
		//console.log(wt[0],bt[0],exectuteTimes[0]+1)
		var t = 0;
		var quantum = parseInt($('#quantum').val());

		while (1) {
			var done = true;
			for (var i = 0; i < bt.length; i++) {
				//console.log('exe',exectuteTimes[i])
				if (exectuteTimes[i] > 0) {
					done = false;

					if (exectuteTimes[i] > quantum) {
						t = t + quantum;
						exectuteTimes[i] -= quantum;
					} else {
						t = t + exectuteTimes[i];
						//console.log(wt);
						wt[i] = t - bt[i];
						exectuteTimes[i] = 0;
					}
				}
			}
			if (done == true) break;
		}

		for (var i = 0; i < bt.length; i++) tat[i] = bt[i] + wt[i];

		//console.log(wt)
		for (var i = 0; i < bt.length; i++) {
			//console.log(wt[i],tat[i])
			$(inputTable[i + 1].children[3]).text(wt[i]);
			$(inputTable[i + 1].children[5]).text(tat[i]);
		}
	} else if (algorithm == 'Best-job-first') {
		var exectuteTimes = [];
		var priority = [];
		var perAtime = [];
		var perBtime = [];
		var perPriority = [];
		var factor = [];
		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
			priority[key - 1] = parseInt($(value.children[4]).children().first().val());
			perAtime[key - 1] = parseInt($(value.children[6]).children().first().val());
			perBtime[key - 1] = parseInt($(value.children[7]).children().first().val());
			perPriority[key - 1] = parseInt($(value.children[8]).children().first().val());
			factor[key - 1] =
				priority[key - 1] * perPriority[key - 1] / 100 +
				(key - 1) * perAtime[key - 1] / 100 +
				exectuteTimes[key - 1] * perBtime[key - 1] / 100;
		});
		var currentIndex = -1;

		for (var i = 0; i < exectuteTimes.length; i++) {
			$(inputTable[i + 1].children[9]).text(factor[i].toFixed(2));
			$(inputTable[i + 1].children[1]).text(0);
		}

		for (var i = 0; i < exectuteTimes.length; i++) {
			tat = 0;
			currentIndex = findNextIndexWithPriority(currentIndex, factor);

			if (currentIndex == -1) return;

			tat = exectuteTimes[currentIndex] + totalExectuteTime;

			$(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);
			$(inputTable[currentIndex + 1].children[5]).text(tat);

	//		console.log('CI: ', currentIndex);
			totalExectuteTime += exectuteTimes[currentIndex];
		}
	}
}

function findNextIndexWithPriority(currentIndex, priorities) {
	var currentPriority = 1000000;
	if (currentIndex != -1) currentPriority = priorities[currentIndex];
	var resultPriority = 0;
	var resultIndex = -1;
	var samePriority = false;
	var areWeThereYet = false;

	$.each(priorities, function(key, value) {
		var changeInThisIteration = false;

		if (key == currentIndex) {
			areWeThereYet = true;
			return true;
		}
		if (value <= currentPriority && value >= resultPriority) {
			if (value == resultPriority) {
				if (currentPriority == value && !samePriority) {
					samePriority = true;
					changeInThisIteration = true;
					resultPriority = value;
					resultIndex = key;
				}
			} else if (value == currentPriority) {
				if (areWeThereYet) {
					samePriority = true;
					areWeThereYet = false;
					changeInThisIteration = true;
					resultPriority = value;
					resultIndex = key;
				}
			} else {
				resultPriority = value;
				resultIndex = key;
			}

			if (value > resultPriority && !changeInThisIteration) samePriority = false;
		}
	});
	return resultIndex;
}

function findNextIndex(currentIndex, array) {
	var currentTime = 0;
	if (currentIndex != -1) currentTime = array[currentIndex];
	var resultTime = 1000000;
	var resultIndex = -1;
	var sameTime = false;
	var areWeThereYet = false;

	$.each(array, function(key, value) {
		var changeInThisIteration = false;

		if (key == currentIndex) {
			areWeThereYet = true;
			return true;
		}
		if (value >= currentTime && value <= resultTime) {
			if (value == resultTime) {
				if (currentTime == value && !sameTime) {
					sameTime = true;
					changeInThisIteration = true;
					resultTime = value;
					resultIndex = key;
				}
			} else if (value == currentTime) {
				if (areWeThereYet) {
					sameTime = true;
					areWeThereYet = false;
					changeInThisIteration = true;
					resultTime = value;
					resultIndex = key;
				}
			} else {
				resultTime = value;
				resultIndex = key;
			}

			if (value < resultTime && !changeInThisIteration) sameTime = false;
		}
	});
	return resultIndex;
}

function animate() {
	$('fresh').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');

	$('#curtain').width($('#resultTable').width());
	$('#curtain').css({ left: $('#resultTable').position().left });

	var sum = 0;
	$('.exectime').each(function() {
		sum += Number($(this).val());
	});

	var distance = $('#curtain').css('width');

	animationStep(sum, 0);
	jQuery('#curtain').animate({ width: '0', marginLeft: distance }, sum * 1000 / 2, 'linear');
}

function animationStep(steps, cur) {
	$('#timer').html(cur);
	if (cur < steps) {
		setTimeout(function() {
			animationStep(steps, cur + 1);
		}, 500);
	} else {
	}
}

function draw() {
	$('fresh').html('');
	var inputTable = $('#inputTable tr');
	var th = '';
	var td = '';

	var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
	if (algorithm == 'fcfs') {
		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			var executeTime = parseInt($(value.children[2]).children().first().val());
			th += '<th style="height: 60px; width: ' + executeTime * 20 + 'px;">P' + (key - 1) + '</th>';
			td += '<td>' + executeTime + '</td>';
		});

		$('fresh').html('<table id="resultTable"><tr>' + th + '</tr><tr>' + td + '</tr></table>');
	} else if (algorithm == 'sjf') {
		var executeTimes = [];

		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			var executeTime = parseInt($(value.children[2]).children().first().val());
			executeTimes[key - 1] = { executeTime: executeTime, P: key - 1 };
		});

		executeTimes.sort(function(a, b) {
			if (a.executeTime == b.executeTime) return a.P - b.P;
			return a.executeTime - b.executeTime;
		});

		$.each(executeTimes, function(key, value) {
			th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;">P' + value.P + '</th>';
			td += '<td>' + value.executeTime + '</td>';
		});

		$('fresh').html('<table id="resultTable"><tr>' + th + '</tr><tr>' + td + '</tr></table>');
	} else if (algorithm == 'priority') {
		var executeTimes = [];

		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			var executeTime = parseInt($(value.children[2]).children().first().val());
			var priority = parseInt($(value.children[4]).children().first().val());
			executeTimes[key - 1] = { executeTime: executeTime, P: key - 1, priority: priority };
		});

		executeTimes.sort(function(a, b) {
			if (a.priority == b.priority) return a.P - b.P;
			return b.priority - a.priority;
		});

		$.each(executeTimes, function(key, value) {
			th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;">P' + value.P + '</th>';
			td += '<td>' + value.executeTime + '</td>';
		});

		$('fresh').html('<table id="resultTable" style="width: 70%"><tr>' + th + '</tr><tr>' + td + '</tr></table>');
	} else if (algorithm == 'robin') {
		var quantum = $('#quantum').val();
		var executeTimes = [];

		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			var executeTime = parseInt($(value.children[2]).children().first().val());
			executeTimes[key - 1] = { executeTime: executeTime, P: key - 1 };
		});

		var areWeThereYet = false;
		while (!areWeThereYet) {
			areWeThereYet = true;
			$.each(executeTimes, function(key, value) {
				if (value.executeTime > 0) {
					th +=
						'<th style="height: 60px; width: ' +
						(value.executeTime > quantum ? quantum : value.executeTime) * 20 +
						'px;">P' +
						value.P +
						'</th>';
					td += '<td>' + (value.executeTime > quantum ? quantum : value.executeTime) + '</td>';
					value.executeTime -= quantum;
					areWeThereYet = false;
				}
			});
		}
		$('fresh').html('<table id="resultTable" style="width: 70%"><tr>' + th + '</tr><tr>' + td + '</tr></table>');
	} else if (algorithm == 'Best-job-first') {
		var exectuteTimes = [];
		var priority = [];
		var perAtime = [];
		var perBtime = [];
		var perPriority = [];
		var factor = [];
		var executeTimes = [];
		$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
			priority[key - 1] = parseInt($(value.children[4]).children().first().val());
			perAtime[key - 1] = parseInt($(value.children[6]).children().first().val());
			perBtime[key - 1] = parseInt($(value.children[7]).children().first().val());
			perPriority[key - 1] = parseInt($(value.children[8]).children().first().val());
			factor[key - 1] =
				priority[key - 1] * perPriority[key - 1] / 100 +
				(key - 1) * perAtime[key - 1] / 100 +
				exectuteTimes[key - 1] * perBtime[key - 1] / 100;
			executeTimes[key - 1] = { executeTime: exectuteTimes[key - 1], P: key - 1, priority: factor[key - 1] };
		});

		executeTimes.sort(function(a, b) {
			if (a.priority == b.priority) return a.P - b.P;
			return b.priority - a.priority;
		});

		$.each(executeTimes, function(key, value) {
			th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;">P' + value.P + '</th>';
			td += '<td>' + value.executeTime + '</td>';
		});

		$('fresh').html('<table id="resultTable" style="width: 70%"><tr>' + th + '</tr><tr>' + td + '</tr></table>');
	}
	animate();
}


function avg()
{
	// $('fresh').html('');
	var inputTable = $('#inputTable tr');
	var sumwt = 0;
	var sumtat = 0;
	var nP=0;

	var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();


	$('#inputTable .servtime').each(function(key, value) {
	  // alert($(this).html());
	  var s = $(this).html();
	  if(s == "Waiting Time")
	  	return true;
	  sumwt += parseInt(s);
	});

	$('#inputTable .turnAroundTime').each(function(key, value) {
	  // alert($(this).html());
	  var s = $(this).html();
	  if(s == "Turn Around Time")
	  	return true;
	  sumtat += parseInt(s);
	});

	$.each(inputTable, function(key, value) {
			if (key == 0) return true;
			nP=key;
		});

	
	$('#Avgwt').html(sumwt/nP);
	$('#Avgtat').html(sumtat/nP);
	
}
