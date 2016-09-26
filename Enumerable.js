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

Enumerable.Range = function(start, finish) {

    var result = new Enumerable(new Array());

    for(var i = start; i < finish; i++) {

        result.dataSource.push(i);
    }

    return result;
};

Enumerable.prototype = {
    _Partition: function(arr, start, finish) {

        var pivot = arr[finish];

        var low = start;

        for(var i = start; i < finish; i++) {

            if(arr[i] <= pivot) {

                var temp = arr[i];
                arr[i] = arr[low];
                arr[low] = temp;
                low++;

            }
        }

        var t = arr[low];
        arr[low] = arr[finish];
        arr[finish] = t;

        return low;
    },
    _QuickSort: function(arr, start, finish) {

        if(start < finish) {

            var partition = this._Partition(arr, start, finish);

            this._QuickSort(arr, start, partition - 1);
            this._QuickSort(arr, partition + 1, finish);
        }
        return arr;
    },
    dataSource: undefined,
    ForEach: function(callBack, start, end) {

        var keys = Object.keys(this.dataSource);

        if(!start) start = 0;
        if(!end) end = keys.length;

        for(var i = start; i < end; i++) {

            var key = keys[i];
            callBack(key, this.dataSource[key]);
        }

    },
    Select: function(callBack) {

        var result = new Enumerable();

        var selectFunction = function(idx, elem) {
            var column = callBack(elem);
            result.dataSource.push(column);
        }

        this.ForEach(selectFunction);

        return result;
    },
    SelectMany: function(callBack) {

        var result = new Enumerable();

        var selectManyFunction = function(idx, elem) {
            var column = callBack(elem);
            result.dataSource = result.dataSource.concat(column);
        }

        this.ForEach(selectManyFunction);

        return result;

    },
    Where: function(callBack) {

        var result = new Enumerable();

        var whereFunction = function(idx, elem) {

            if(callBack(elem)) result.dataSource.push(elem);

        };

        this.ForEach(whereFunction);

        return result;

    },
    Skip: function(number) {

        var result = new Enumerable();

        var SkipFunction = function(idx, elem) {
            result.dataSource.push(elem);
        };

        this.ForEach(SkipFunction, number);

        return result;

    },
    Take: function(number) {

        var result = new Enumerable();

        var TakeFunction = function(idx, elem) {
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
    GroupBy: function(keySelector, elementSelector, resultSelector, compareSelector) {

        var result = new Enumerable({});

        var GroupByCallBack = function(idx, elem) {

            var key = keySelector(elem);

            if(compareSelector) key = compareSelector(key);

            if(elementSelector) elem = elementSelector(elem);

            if(!result.dataSource[key]) result.dataSource[key] = [];

            result.dataSource[key].push(elem);

        };

        this.ForEach(GroupByCallBack);

        if(resultSelector) {

            var dataSource = [];
            var resultFunction = function(key, value) {

                dataSource.push(resultSelector(key, new Enumerable(value)));
                
            };

            result.ForEach(resultFunction);

            result.dataSource = dataSource;
        }

        return result;

    },
    OrderBy: function() {

        var result = new Enumerable(this.dataSource);
        var keysMap = new Enumerable({});
        var args = arguments;

        for(var i = 0; i < args.length; i++) {

            var createKeysMapFunction = function(idx, elem) {

                var callBack = args[i];
                var key = callBack(elem);
                
                if(!keysMap.dataSource[key]) keysMap.dataSource[key] = [];
                keysMap.dataSource[key].push(elem);

            };

            result.ForEach(createKeysMapFunction);

            var keysList = Object.keys(keysMap.dataSource);
            var sortedList = this._QuickSort(keysList, 0, keysList.length - 1);
            console.log(sortedList);
            //result.dataSource = 
        }

        return result;

    },
    OrderByDescending: function() {

    },
    Count: function() {

        return Object.keys(this.dataSource).length;
    },
    ToDictionary: function(keySelector, elementSelector, compareSelector) {


    },
    ToArray: function() {

        if(Array.isArray(this.dataSource)) return this.dataSource;

        var result = [];

        var ToArrayFunction = function(idx, elem) {

            result.push(elem);
        };

        this.ForEach(ToArrayFunction);

        return result;
    }

};

Enumerable.prototype.constructor = Enumerable;