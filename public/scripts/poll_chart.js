let chartLabels = [];
let chartData = [];
var elements = this.document.getElementsByClassName('chartData');
for (i = 0; i < elements.length; i++) {
    chartLabels.push(elements[i].textContent.split(' ').slice(0, elements[i].textContent.split(' ').length-1).join(' '));
    chartData.push(elements[i].textContent.split(' ').slice(-1).join());
}

var ctx = this.document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'pie',
    data: {
	labels: chartLabels,
	datasets: [{
	    data: chartData,
	    backgroundColor: [
		'red',
		'blue',
		'orange',
		'black',
		'yellow',
		'green',
		'white',
		'grey',
		'magenta'
	    ]
	}],
	options: {
	    responsive: true
	}
    }
});
    
