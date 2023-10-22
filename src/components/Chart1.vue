<template>
    <p class="temp">{{title}}</p>
    <div class="chartBox">
        <div class="colSmall">
            <Line id="my-chart-id" :options="chartOptions2" :data="chartData2" v-if="display"/>
        </div>
        <div class="colLarge">
            <div class="box">
                <Line id="my-chart-id" :options="chartOptions1" :data="chartData1" v-if="display"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { Line } from 'vue-chartjs'
    import 'chart.js/auto'

    export default {
        // eslint-disable-next-line vue/multi-word-component-names
        name: "Chart1",
        props: ["temperatureArray", "timeArray", "display"],
        components: { Line },
        data() {
            return {
                title: ""
            }
        },
        computed: {
                chartData1() {
                    return {
                        labels: [ this.timeArray ],                        
                        backgroundColor: '#f87979',
                        datasets: [ { data: this.temperatureArray } ]
                    }
                },
                chartOptions1() {
                    return {
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                top: 9,
                                bottom: 15
                            }
                        },
                        responsive: true,
                        scales: {
                            y: {
                                ticks: {
                                    display: false
                                },
                                grid: {
                                    drawTicks: false,
                                    drawBorder: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const temp = parseInt(context.parsed.y)
                                        if(temp < 13) {
                                            return context.parsed.y + "°C Cold"
                                        }
                                        else if(temp >= 13 && temp <= 23) {
                                            return context.parsed.y + "°C Mild"
                                        }
                                        else {
                                            return context.parsed.y + "°C Hot"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                chartData2() {
                    return {
                        labels: [ this.timeArray ],
                        backgroundColor: '#f87979',
                        datasets: [ 
                            { 
                                data: this.temperatureArray,
                                borderWidth: 0
                            } 
                        ]
                    }
                },
                chartOptions2() {
                    return {
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                bottom: 44
                            }
                        },
                        responsive: true,
                        scales: {
                            x: {
                                ticks: {
                                    display: false
                                },
                                grid: {
                                    drawTicks:false
                                }
                            },
                            y: {
                                afterFit: (ctx) => {
                                    ctx.width = 35
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        elements: {
                            point:{
                                radius: 0
                            }
                        }
                    }
                }
            },
        watch: {
            temperatureArray: function(newData) {
                this.chartData1.datasets[0].data = newData
                this.chartData2.datasets[0].data = newData
                this.title = "Temperature(°C)"
            },
            timeArray: function(newData) {
                this.chartData1.labels = newData
                this.chartData2.labels = newData
            },
        },
    }
</script>

<style scoped>
    .chartBox {
        width: 700px;
        display: flex;
    }
    .colSmall {
        width: 35px;
    }
    .colLarge {
        max-width: 700px;
        overflow-x: scroll;
    }
    .box {
        width: 2000px;
        height: 500px;
    }
    .temp {
        font-size: 20px;
        font-weight: bold;
    }
</style>
