const fs = require('fs')
const path = require('path');

let config = {
    paths : [
        {   from : './test/client',
            to : './test/result/client'
        },
        {   from : './test/server',
            to : './test/result/server'
        }
    ],
    direct : 'crlf-to-lf', //lf-to-crlf 
}

//-----------------------------------------------------------------
function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir)
    for (const file of fileList) {
        const name = `${dir}/${file}`
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files)
        } else {
            files.push(name)
        }
    }
    return files
};
//-----------------------------------------------------------------
config.paths.forEach(pth => {
    let { from,to } = pth;

    let list = getFiles(from);

    list.forEach(it => {
        let out =it.replace(from,to);
        let dir = path.dirname(out);
    
        fs.readFile(it, 'utf8', (err, data) => {
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });         
            }
            if (config.direct === 'crlf-to-lf'){
                data = data.replace(/\r\n/g, "\n");
            }else{
                let tmp = '<^#&N^>';
                data = data.replace(/\r\n/g, tmp);
                data = data.replace( "\n",/\r\n/g);
                data = data.replace(tmp,/\r\n/g);
            } 
    
            fs.writeFile(out,data,'utf8',(err)=>{
                if (err){
                    throw err;
                }
            });
        });
    });
});