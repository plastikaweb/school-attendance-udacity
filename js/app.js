$(function () {

    var model = {
        students: ['Slappy the Frog', 'Lilly the Lizard', 'Paulrus the Walrus', 'Gregory the Goat', 'Adam the Anaconda'],
        numberOfDays: 12,
        getAttendances: function () {
            return JSON.parse(localStorage.attendance);
        },
        updateAttendances: function (newAttendance) {
            localStorage.attendance = JSON.stringify(newAttendance);
        },
        randomInitData: function () {
            console.log('Creating attendance records...');
            function getRandom() {
                return (Math.random() >= 0.5);
            }
            var attendance = {};
            this.students.forEach(function (student) {
                attendance[student] = [];
                for (var i = 0; i <= 11; i++) {
                    attendance[student].push(getRandom());
                }
            });
            this.updateAttendances(attendance);
        }
    };

    var controller = {
        init: function () {
            model.randomInitData();
            view.init();
        },
        getStudents: function () {
            return model.students;
        },
        getNumberOfDays: function () {
            return model.numberOfDays
        },
        getAttendances: function () {
            return model.getAttendances();
        },
        getTotalMissedDays: function () {
            var missedDays = {};
            var attendances = model.getAttendances();
            for (var prop in attendances) {
                missedDays[prop] = 0;
                attendances[prop].forEach(function (val) {
                    if (val) {
                        missedDays[prop]++;
                    }
                });
            }
            return missedDays;
        },
        updateAttendances: function (data) {
            var attendances = this.getAttendances();
            attendances[data.student][data.day] = !attendances[data.student][data.day];
            model.updateAttendances(attendances);
            view.drawCountMissing();
        }
    };

    var view = {
        init: function () {
            //cache selectors
            this.$table = $('table');
            this.draw();
        },
        draw: function () {
            this.drawHeaderTable();
            this.drawBodyTable();
            this.drawMissedDaysFromLS();
            this.drawCountMissing();
        },
        drawHeaderTable: function () {
            var days = controller.getNumberOfDays() + 1,
                $thead = $('<thead/>'),
                $tr = $('<tr/>');

            var $thStntName = $('<th/>', {
                class: 'name-col',
                text: 'Student Name'
            });
            $tr.append($thStntName);

            var $thDays = [];
            for (var i = 1; i < days; i++) {
                var $th = $('<th/>', {
                    text: i
                });
                $thDays.push($th);
            }
            $tr.append($thDays);

            var $thMissedDays = $('<th/>', {
                class: 'missed-col',
                text: 'Days Missed'
            });
            $tr.append($thMissedDays);
            $thead.append($tr);
            this.$table.append($thead);
        },
        drawBodyTable: function () {
            var days = controller.getNumberOfDays() + 1,
                students = controller.getStudents(),
                $tbody = $('<tbody/>');

            for (var i = 0; i < students.length; i++) {
                var student = students[i],
                    $tr = $('<tr class="student"></tr>'),
                    $tdStntName = $('<td/>', {
                        class: 'name-col',
                        text: student
                    }),
                    $tdDays = [];
                $tr.append($tdStntName);
                for (var j = 1; j < days; j++) {
                    var $td = $('<td/>', {
                        class: 'attend-col'
                    });
                    var $cb = $('<input type="checkbox">');
                    $cb.on('change', (function (std, index) {
                        return function () {
                            var data = {
                                student: std,
                                day: index - 1
                            };
                            controller.updateAttendances(data);
                        }
                    }(student, j)));
                    $td.append($cb);
                    $tdDays.push($td);
                }
                $tr.append($tdDays);

                var $tdMissedDays = $('<td/>', {
                    class: 'missed-col',
                    text: '0'
                });
                $tr.append($tdMissedDays);
                $tbody.append($tr);
            }
            this.$table.append($tbody);
        },
        drawMissedDaysFromLS: function () {
            $.each(controller.getAttendances(), function (name, arr) {
                var $tdAttend = $('.name-col:contains("' + name + '")').siblings('.attend-col').find('input');
                arr.forEach(function (val, index) {
                    $($tdAttend[index]).prop('checked', val);
                });
            });
        },
        drawCountMissing: function () {
            $.each(controller.getTotalMissedDays(), function (name, value) {
                $('.name-col:contains("' + name + '")').parent().find('.missed-col').text(value);
            });
        }
    };
    controller.init();
}());
