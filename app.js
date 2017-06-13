const watch = require('node-watch');
const fs = require('fs');

class RTLCSS{
    constructor(path){
        this._path = path;
    }

    run(){
        this._watcher = watch(this._path, { recursive: true }, (type, path) =>{

            fs.lstat(path, (err, stats) => {

                if (err)
                    return console.log(err); //Handle error

                if(stats.isFile()  && /\.css$/.test(path) && !/-rtl\.css$/.test(path) && type === 'update'){
                    this.rtl(path);
                }
            });

        });
    }

    rtl(file){
        fs.readFile(file, 'utf8', (err, data) => {
            if(err)
                return console.log(err);
            let rtl = data.replace(/{([^{}]*)}/gi, (match, style) => {
                let rtl_style = style.replace(/left/gi, 'lleefftt')
                    .replace(/right/gi, 'left')
                    .replace(/lleefftt/gi, 'right')
                    .replace(/([^;]*radius[^:]*:\s*)([^;\s]+)\s+([^;\s]+)\s+([^;\s]+)\s+([^;\s]+)/gi,'$1 $3 $2 $5 $4')
                    .replace(/([^;]*(padding|margin)[^:]*:\s*)([^;\s]+)\s+([^;\s]+)\s+([^;\s]+)\s+([^;\s]+)/gi,'$1 $3 $6 $5 $4')
                ;
                return '{' + rtl_style + '}';
            });
            fs.writeFile(file.replace(/\.css$/, '-rtl.css'), rtl, (err) => {
                if (err) throw err;
                console.log(`${ new Date() }: The ${file} has been rtl!`);
            });
        });
    }

}

let rtlcss = new RTLCSS(process.argv[2] || '.');
rtlcss.run();
