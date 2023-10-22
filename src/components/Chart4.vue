<template>
    <p class="pm2_5">{{title}}</p>
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
    <p class="text">{{text}}</p>
</template>

<script>
    import { Line } from 'vue-chartjs'
    import 'chart.js/auto'

    export default {
        // eslint-disable-next-line vue/multi-word-component-names
        name: "Chart4",
        props: ["pm2_5Array", "timeArrayForAirPollution", "display"],
        components: { Line },
        data () {
            return {
                text: "",
                title: ""
            }
        },
        computed: {
                chartData1() {
                    return {
                        labels: [ this.timeArrayForAirPollution ],                        
                        backgroundColor: '#f87979',
                        datasets: [ { data: this.pm2_5Array } ]
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
                                        return context.parsed.y + "μg/m3"
                                    }
                                }
                            }
                        }
                    }
                },
                chartData2() {
                    return {
                        labels: [ this.timeArrayForAirPollution ],
                        backgroundColor: '#f87979',
                        datasets: [ 
                            { 
                                data: this.pm2_5Array,
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
                                bottom: 62
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
                },
            },
        watch: {
            pm2_5Array: function(newData) {
                this.chartData1.datasets[0].data = newData
                this.chartData2.datasets[0].data = newData
                this.title = "PM2.5 Concentration(μg/m3)"
                this.text = "If the volume of PM2.5 exceeds 10μg/m3, it's better to wear a face mask."
            },
            timeArrayForAirPollution: function(newData) {
                this.chartData1.labels = newData
                this.chartData2.labels = newData
            }
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
    .pm2_5 {
        font-size: 20px;
        font-weight: bold;
    }
    .text {
        font-size: 18px;
    }
</style>
