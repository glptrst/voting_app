let chartLabels = [];
let chartData = [];
for (let i = 0; i < this.document.getElementsByClassName('chartData').length; i++) {
    chartLabels.push(this.document.getElementsByClassName('chartData')[i].textContent.split(' ')[0]);
    chartData.push(this.document.getElementsByClassName('chartData')[i].textContent.split(' ')[1]);
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
		'orange',
		'yellow',
		'green',
	    ]
	}],
	options: {
	    responsive: true
	}
    }
});
    
