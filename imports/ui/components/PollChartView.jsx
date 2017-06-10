import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-chartjs';

var LineChart = Chart.Bar;

export default class PollChart extends React.Component {

    render() {
        var data = {
            labels: this.props.labels,
            datasets: [{
                label: '# of Votes',
                data: this.props.scores,
                fillColor: [
                'rgba(0, 95, 139, 0.5)'
                ]
            }]
        };
        var options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };
        return (
            // <canvas ref='pollChart' height={400} width ={400}/>
            <div>
                <LineChart
                    data={data}
                    height={400}
                    options={options}
                    width={400}
                />
        </div>
        );
    }

}

PollChart.propTypes = {
    labels: PropTypes.array,
    scores: PropTypes.array
};
