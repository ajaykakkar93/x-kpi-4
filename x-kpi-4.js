define(["qlik", './extUtils', "text!./style.css", 'ng!$q', 'ng!$http'],
    function(qlik, extUtils, css, $q, $http) {
        var faUrl = extUtils.getBasePath() + '/extensions/x-kpi-4/lib/external/fontawesome/css/font-awesome.min.css';
        extUtils.addStyleLinkToHeader(faUrl, 'x-kpi__fontawesome');
        $("<style id='kip-4'>").html(css).appendTo("head");
        var app = qlik.currApp();
        var getSheetList = function() {
            var defer = $q.defer();
            app.getAppObjectList(function(data) {
                var sheets = [];
                var sortedData = _.sortBy(data.qAppObjectList.qItems, function(item) {
                    return item.qData.rank;
                });
                _.each(sortedData, function(item) {
                    sheets.push({
                        value: item.qInfo.qId,
                        label: item.qMeta.title
                    });
                });
                return defer.resolve(sheets);
            });

            return defer.promise;
        };
        return {
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    measures: {
                        uses: "measures",
                        min: 2,
                        max: 2
                    },
                    switchlayout: {
                        type: "boolean",
                        component: "switch",
                        label: "Switch Layout",
                        ref: "switchlayout",
                        options: [{
                            value: true,
                            label: "Layout 2"
                        }, {
                            value: false,
                            label: "Layout 1"
                        }],
                        defaultValue: false
                    },
                    custom: {
                        label: 'Custom Settings',
                        items: {
                            lay1switch: {
                                type: "boolean",
                                component: "switch",
                                label: "Switch icon to text",
                                ref: "lay1switch",
                                options: [{
                                    value: true,
                                    label: "Type 2"
                                }, {
                                    value: false,
                                    label: "Type 1"
                                }],
                                defaultValue: false,
                                show: function(data) {
                                    if (data.switchlayout) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            },

                            bgcolor: {
                                type: "string",
                                ref: "bgcolor",
                                label: "Background color",
                                expression: "optional",
                                defaultValue: "linear-gradient(60deg, #ef5350, #e53935);"
                            },
                            title: {
                                type: "string",
                                ref: "title",
                                label: "Title",
                                expression: "optional"
                            },

                            ashtml1: {
                                ref: "ashtml1",
                                label: "Add HTML",
                                type: "boolean",
                                defaultValue: false
                            },

                            icon: {
                                type: "string",
                                ref: "iconname",
                                label: "Icon Name",
                                expression: "optional"
                            },

                            footertitle: {
                                type: "string",
                                ref: "footertitle",
                                label: "Footer Title",
                                expression: "optional"
                            },
                        }
                    },
                    navtosheet: {
                        label: 'Navigation',
                        items: {
                            sheetlst: {
                                type: "string",
                                component: "dropdown",
                                label: "Select Sheet",
                                ref: "gotosheet",
                                options: function() {
                                    return getSheetList().then(function(items) {
                                        return items;
                                    });
                                }
                            },
                        }
                    },
                    visual: {
                        label: "Customization",
                        items: {
                            progresscolor: {
                                type: "string",
                                ref: "progresscolor",
                                label: "Progress Color",
                                expression: "optional"
                            },

                            progresscolor2: {
                                type: "string",
                                ref: "progresscolor2",
                                label: "Negative Progress Color",
                                expression: "optional"
                            },
                            titlecss: {
                                type: "string",
                                ref: "titlecss",
                                label: "Title css",
                                expression: "optional"
                            },
                            measurecss: {
                                type: "string",
                                ref: "measurecss",
                                label: "Value css",
                                expression: "optional"
                            },
                            footertitlecss: {
                                type: "string",
                                ref: "footertitlecss",
                                label: "Footer Title css",
                                expression: "optional"
                            },
                            // end
                        }
                    },
                    settings: {
                        uses: "settings",
                    }
                }
            },

            support: {
                snapshot: false,
                export: false,
                exportData: false
            },
            paint: function($element, layout) {
                var html = '',
                    html2 = '';
                var Measure = (layout.qHyperCube.qGrandTotalRow["0"].qText);
                console.log('measure 1: ', layout.qHyperCube.qGrandTotalRow["0"].qText);

                var Measure2 = (layout.qHyperCube.qGrandTotalRow["1"].qText);
                console.log('measure 2: ', layout.qHyperCube.qGrandTotalRow["1"].qText);

                var titlecss = layout.titlecss,
                    measurecss = layout.measurecss,
                    footertitlecss = layout.footertitlecss;

                var switchlayout = layout.switchlayout;
                var lay1switch = layout.lay1switch;

                html += '<div class="card card-stats" id="gotosheet_' + layout.gotosheet + '">';
                html += '<div class="card-title-header">';
                html += '  <div class="stats" style="' + titlecss + '">' + layout.title + '</div>';
                html += '	</div>';

                if (lay1switch) {
                    html += '  <div class="card-header" style="   padding-top: 12px;  ">';
                    html += '  <div class="outerTag" style="  background: ' + layout.bgcolor + ' !important; color:#fff; "> ' + Measure2 + '';

                    if (layout.ashtml1) {
                        html += layout.iconname;
                    } else {
                        html += '<i class="' + layout.iconname + '" aria-hidden="true"></i>';
                    }

                    html += '  </div>';
                    html += '    </div>';
                } else {


                    html += '  <div class="card-header" data-background-color="orange" style="  background: ' + layout.bgcolor + ' !important; color:#fff; ">';

                    if (layout.ashtml1) {
                        html += layout.iconname;
                    } else {
                        html += '<i class="' + layout.iconname + '" aria-hidden="true" style=" ' + layout.bgcolor + '"></i>';
                    }

                    html += '  </div>';
                }

                html += '  <div class="card-content">';
                html += '  <h3 class="title" style="' + measurecss + '">' + Measure + '</h3>';
                html += '	<p class="category" style="' + footertitlecss + '">' + layout.footertitle + '</p>';
                html += '   </div>';
                html += '   <div class="card-footer">';
                html += '   <div class="progress-info">';
                html += '      <div class="progress">';

                var splittable = Measure2.split('%');
                console.log(splittable[0]);

                if (splittable[0].indexOf("-") == -1) {

                    console.log('0');

                    html += '        <span style="width: ' + Measure2 + '; background: ' + layout.progresscolor + ' !important; " class="progress-bar progress-bar-success purple-soft tooltip" title="' + Measure2 + '">';

                } else {
                    console.log('1');
                    console.log(Measure2.split('-')[1]);

                    //var splittable2 = splittable[1].split('%');
                    //	console.log(splittable2[0]);

                    html += '        <span style="width: ' + Measure2.split('-')[1] + '; background: ' + layout.progresscolor2 + ' !important; " class="progress-bar progress-bar-success purple-soft tooltip" title="' + Measure2 + '">';


                }

                //	html += '        <span style="width: ' + Measure2 + '; background: ' + layout.progresscolor + ' !important; " class="progress-bar progress-bar-success purple-soft tooltip" title="' + Measure2 + '">';


                html += '       <span class="tooltiptext">' + Measure2 + '</span> ';
                html += '        </span>';
                html += '     </div>';
                html += '      </div>';
                html += ' </div>';
                html += '  </div>';
                // ui 2
                html2 += '  	<div class="dashboard-stat2 "  id="gotosheet_' + layout.gotosheet + '">  ';
                html2 += '     <div class="display">';
                html2 += '       <div class="number">';
                html2 += '         <h3 class="font-green-sharp">';
                html2 += '             <span data-counter="counterup" style="' + measurecss + '">' + Measure + '</span>';
                //  html2 += '             <small class="font-green-sharp">$</small>';
                html2 += '        </h3>';
                html2 += '         <small  style="' + titlecss + '" style=" ' + titlecss + ' !important; " >' + layout.title + '</small>';
                html2 += '      </div>';
                html2 += '     <div class="icon">';

                if (layout.ashtml1) {
                    html2 += layout.iconname;
                } else {
                    html2 += '<i class="' + layout.iconname + '" aria-hidden="true" style=" ' + layout.bgcolor + '"></i>';
                }

                html2 += '     </div>';
                html2 += '   </div>';
                html2 += '   <div class="progress-info">';
                html2 += '       <div class="progress">';

                if (splittable[0].indexOf("-") == -1) {

                    console.log('0');
                    html2 += '          <span style="width: ' + Measure2 + ';  background: ' + layout.progresscolor + ' !important;  " class="progress-bar progress-bar-success green-sharp">';

                } else {
                    console.log('1');
                    console.log(Measure2.split('-')[1]);
                    html2 += '          <span style="width: ' + Measure2.split('-')[1] + ';  background: ' + layout.progresscolor2 + ' !important;  " class="progress-bar progress-bar-success green-sharp">';
                }

                //html2 += '          <span style="width: ' + Measure2 + ';  background: ' + layout.progresscolor + ' !important;  " class="progress-bar progress-bar-success green-sharp">';

                html2 += '              <span class="sr-only">76% progress</span>';
                html2 += '        </span>';
                html2 += '      </div>';
                html2 += '     <div class="status">';
                html2 += '         <div class="status-title" style="' + footertitlecss + '"> ' + layout.footertitle + ' </div>';
                html2 += '        <div class="status-number"> ' + Measure2 + ' </div>';
                html2 += '     </div>';
                html2 += '     </div>';
                html2 += '    </div>';

                if (switchlayout) {
                    $element.html(html);
                } else {
                    $element.html(html2);
                }

                var result = qlik.navigation.getMode();
                if (result == 'analysis') {
                    console.log('ANALYSIS');
                    $('#gotosheet_' + layout.gotosheet).click(function() {
                        console.log('click');
                        qlik.navigation.gotoSheet(layout.gotosheet);
                    });
                };

                $('.qv-object-x-kpi-4 .qv-object-header').hide();
                // end
            }
        };

    });
