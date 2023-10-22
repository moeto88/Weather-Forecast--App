<template>
    <p class="rain">{{title}}</p>
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

    <p class="text">{{ rain }}</p>
</template>

<script>
    import { Line } from 'vue-chartjs'
    import 'chart.js/auto'

    export default {
        // eslint-disable-next-line vue/multi-word-component-names
        name: "Chart3",
        props: ["rainArray", "rainFlagWithDate", "timeArray", "display"],
        components: { Line },
        data () {
            return {
                rain: "",
                title: ""
            }
        },
        computed: {
                chartData1() {
                    return {
                        labels: [ this.timeArray ],                        
                        backgroundColor: '#f87979',
                        datasets: [ { data: this.rainArray } ]
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
                                        return context.parsed.y + "mm"
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
                                data: this.rainArray,
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
                },
            },
        watch: {
            rainArray: function(newData) {
                this.chartData1.datasets[0].data = newData
                this.chartData2.datasets[0].data = newData
                this.title = "Rain Volume(mm/3h)"
            },
            timeArray: function(newData) {
                this.chartData1.labels = newData
                this.chartData2.labels = newData
            },
            rainFlagWithDate: function(newData) {
                const rainFlag = newData
                let text = "You should pack an umbrella on "
                let forIfFlag = false
                for(let key in rainFlag) {
                    if(rainFlag[key]) {
                        text = text.concat(key + ", ")
                        forIfFlag = true
                    }
                }

                if(forIfFlag) {
                    text = text.slice(0, -2)
                    this.rain = text
                }
                else {
                    text = "You don't need to pack an umbrella in the next 5 days"
                }
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
    .rain {
        font-size: 20px;
        font-weight: bold;
    }
    .text {
        font-size: 18px;
    }
</style>
