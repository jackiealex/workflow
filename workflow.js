function doParallelLimit(tasks, limit, notify, done) {
    // 一次性执行limit个，然后每次完成一个，进行下一个
    var i = 0;
    var count = 0;
    var rsArray = [];
    var taskWrapper = function(fn) {
        if (typeof fn != 'function') {
            throw Error('task not a function');
        }
        fn().done(function(rs) {
            count++;
            notify(rs, count);
            rsArray.push(rs);
            if (i < tasks.length) {
                taskWrapper(tasks[i++]);
            }
            if (count == tasks.length) {
                done(rsArray);
            }
        })
    }
    limit = Math.min(limit, tasks.length);
    for (i = 0; i < limit; i++) {
        var fn = tasks[i];
        taskWrapper(fn);
    }
}