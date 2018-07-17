Vue.component('vTable',{
    props:{
        columns:{
            type:Array,
            default:function(){
                return [];
            }
        },
        data:{
            type:Array,
            default:function(){
                return [];
            }
        }
    },
    data:function(){
        return {
            currentColumns:[],
            currentData:[]
        }
    },
    mounted:function(){
        this.makeColumns();
        this.makeData();
    },
    methods:{
        makeColumns:function(){
            this.currentColumns=this.columns.map(function(col,index){
                //添加一个字段 标识当前列排序的状态，后续使用
                col._sortType='normal';
                col._index=index;
                return col;
            })
        },
        makeData:function(){
            this.currentData=this.data.map(function(row,index){
                 row._index=index;
                 return row;
            })
        },
        handleSortByAsc:function(index){
            var key=this.currentColumns[index].key;
            this.currentColumns.forEach(function(col){
                col._sortType='normal';
            });
            this.currentData.sort(function(a,b){
                return a[key]>b[key]? 1:-1;
            })
        },
        handleSortByDesc:function(index){
             var key=this.currentColumns[index].key;
             this.currentColumns.forEach(function(col){
                  col._sortType='normal';
             })
            this.currentColumns[index]._sortType='desc';
             this.currentData.sort(function(a,b){
                 return a[key]<b[key] ?1:-1;
             })
        }
    },
    watch:{
        data:function(){
            this.makeData();
            var sortedColumn=this.currentColumns.filter(function(col){
                return col._sortType !== 'normal';
            });
            if(sortedColumn.length>0){
                if(sortedColumn[0]._sortType === 'asc'){
                    this.handleSortByAsc(sortedColumn[0]._index);
                }else{
                    this.handleSortByDesc(sortedColumn[0]._index);
                }
            }
        }
    },
    render:function(h){
        var  _this=this;
        var ths=[];
        this.currentColumns.forEach(function(col,index){
             if(col.sortable){
                 ths.push(h('th',[
                     h('span',col.title),
                     h('a',{
                         class:{
                             on:col._sortType === 'asc'
                         },
                         on:{
                             click:function(){
                                 _this.handleSortByAsc(index);
                             }
                         }
                     },'T'),
                     h('a',{
                         class:{
                             on:col._sortType === 'desc'
                         },
                         on:{
                             click:function(){
                                 _this.handleSortByDesc(index);
                             }
                         }
                     },'i')

                 ]))
             }else{
                 ths.push(h('th',col.title));
             }
        });

        var trs=[];
        this.currentData.forEach(function(row){
             var tds=[];
             _this.currentColumns.forEach(function(cell){
                  tds.push(h('td',row[cell.key]));
             });
             trs.push(h('tr',tds));
        });
        return h('table',[
            h('thead',[
                h('tr',ths)
            ]),
            h('tbody',trs)
        ])

    }
})