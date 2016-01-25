'use strict';

const EventEmitter = require('events').EventEmitter;
const nodeSchedule = require('node-schedule');




/**
 * [== TIMEEDIT API ==]
 * @param  {[string]} roomId [id på rummet vi vill ha information om]
 * @return {[object]}        [boknings information]
 */
let getRoomSchedule = (roomId) => {
    return new Promise(function(resolve, reject) {
        resolve([
            {
                booking: {
                    time: {
                        start: '10:00',
                        end: '12:00'
                    }
                }
            },

            {
                booking: {
                    time: {
                        start: '13:00',
                        end: '14:00'
                    }
                }
            }
        ]);
    });
};




/**
 * [== EMITTER ==]
 * @return {[object]}   [Emittern (retunerar samma emitter till alla)]
 */
const e = new EventEmitter();
let getEmitter = () => {
    return e;
};




/**
 * [== JOBS ==]
 * @param  {[string]} time    [tiden då jobbet kommer köras]
 * @param  {[object]} emitter [skickar ut ett event som man kan lyssna på]
 * @param  {[string]} emitId  [id som emittern kommer skicka data på]
 * @param  {[object]} data    [om man vill skicka med data med emittern]
 * @return {[object]}         [instance av ett nytt nodeSchedule job]
 */
let makeEmittJob = (time, emitter, emitId, data) => {
    // fixing time and date..
    let timeSplit = time.split(':');
    let date = new Date('2016', '0', '24', timeSplit[0], timeSplit[1]);

    // actual code
    return nodeSchedule.scheduleJob(date, function() {
        emitter.emit(emitId, data);
    }.bind(null, emitter, emitId, data));
};




/*== MODULE ==*/
let MyModule = function(){
    console.log('Starting myModule');
};

/**
 * [init function som alla muduler måste ha]
 */
MyModule.prototype.init = function () {
    getRoomSchedule()
        .then((roomSchedule) => {
            return roomSchedule.map((bookingSchedule) => {
                return [
                    makeEmittJob(bookingSchedule.booking.time.start, getEmitter(), 'ny105', {color: 'red'}),
                    makeEmittJob(bookingSchedule.booking.time.end, getEmitter(), 'ny105', {color: 'green'})
                ];
            });
        }).then((emitJobs) => {
            this.emitters(getEmitter());
            // cancel jobs?
            // run jobs?
        });
};

/**
 * [här lyssnar vi på event]
 * @param  {[object]} emitter [emittern man använder för att lyssna på event]
 */
MyModule.prototype.emitters = function (emitter) {
    emitter.on('ny105', (event) => {
        console.log('== ny105 ==');
        console.log(event);
        // Här kör vi kod som tex, byta lamp färg
    });

    emitter.on('ny112', (event) => {
        console.log('== ny112 ==');
        console.log(event);
    });
};




let myModule = new MyModule();
myModule.init();
