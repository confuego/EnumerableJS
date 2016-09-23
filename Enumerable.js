function Enumerable(dataSource)
{
    if(!dataSource) this.dataSource = [];
    else this.dataSource = dataSource;
}

Enumerable.From = function(dataSource) {

    var enumerable = new Enumerable();
    enumerable.dataSource = dataSource;

    return enumerable;
};

Enumerable.prototype = {

    dataSource: undefined,
    Range: function(start, finish) {

        var result = new Enumerable(new Array());

        for(var i = start; i < finish; i++) {

            result.dataSource.push(i);
        }

        return result;
    },
    ForEach: function(callBack, start, end) {

        var keys = Object.keys(this.dataSource);

        if(!start) start = 0;
        if(!end) end = keys.length;

        for(var i = start; i < end; i++) {

            var key = keys[i];
            callBack(this.dataSource[key]);
        }

    },
    Select: function(callBack) {

        var result = new Enumerable();

        var selectFunction = function(elem) {
            var column = callBack(elem);
            result.dataSource.push(column);
        }

        this.ForEach(selectFunction);

        return result;
    },
    SelectMany: function(callBack) {

        var result = new Enumerable();

        var selectManyFunction = function(elem) {
            var column = callBack(elem);
            result.dataSource = result.dataSource.concat(column);
        }

        this.ForEach(selectManyFunction);

        return result;

    },
    Where: function(callBack) {

        var result = new Enumerable();

        var whereFunction = function(elem) {

            if(callBack(elem)) result.dataSource.push(elem);

        };

        this.ForEach(whereFunction);

        return result;

    },
    Skip: function(number) {

        var result = new Enumerable();

        var SkipFunction = function(elem) {
            result.dataSource.push(elem);
        };

        this.ForEach(SkipFunction, number);

        return result;

    },
    Take: function(number) {

        var result = new Enumerable();

        var TakeFunction = function(elem) {
            result.dataSource.push(elem);
        };

        this.ForEach(TakeFunction, 0, number);

        return result;
    },
    TakeWhile: function(callBack) {

        var result = new Enumerable();

        for(var i = 0; i < this.dataSource.length; i++) {

            if(callBack(this.dataSource[i])) result.dataSource.push(this.dataSource[i]);
            else return result;
        }

        return result;

    },
    SkipWhile: function(callBack) {

        var result = new Enumerable();

        for(var i = 0; i < this.dataSource.length; i++) {

            if(!callBack(this.dataSource[i])) {

                result.dataSource = this.dataSource.slice(i, this.dataSource.length);
                return result;
            }
        }

        return result;

    },
    GroupBy: function(keySelector, elementSelector, resultSelector, comparer) {

        var result = new Enumerable({});

        var GroupByCallBack = function(elem) {

            var key = keySelector(elem);

            if(!result.dataSource[key]) result.dataSource[key] = [];

            result.dataSource[key].push(elementSelector(elem));

        };

        this.ForEach(GroupByCallBack);
        result.dataSource = dataSource;

        return result;

    },
    ToArray: function() {

        if(Array.isArray(this.dataSource)) return this.dataSource;

        var result = [];

        var ToArrayFunction = function(elem) {

            result.push(elem);
        };

        this.ForEach(ToArrayFunction);

        return result;
    }

};

Enumerable.prototype.constructor = Enumerable;