import { useState ,useRef} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

function Analysis({frames, option,setoption ,toggle, settoggle ,loading, setloading,position,text,settext,setposition})
{
    setloading(0);
    function sizeToFit() {
        gridRef.current.api.sizeColumnsToFit();
      }
    const gridRef = useRef();
    const columnDefs =  [
        {field:"Found",headerName:"Found", resizable: true , sortable: true,filter: true},
        {field:"PersonID",headerName:"PersonID",resizable: true , sortable: true,filter: true},
        {field:"Camera",headerName:"Camera",resizable: true , sortable: true,filter: true},
        {field:"Place",headerName:"Place",resizable: true , sortable: true,filter: true},
        {field:"Time",headerName:"Time", resizable: true , sortable: true,filter: true},
    ]
    const [rowData,setrowData] = useState([]);
    console.log(position,text,"AnalysisAnalysisAnalysisAnalysis");
    const [count,setcount] = useState(1);
    let canvasElem = document.querySelector("canvas");
    const [currentFrame,setcurrentFrame] = useState(0);
    // var c = document.getElementById("myCanvas");
    // var ctx = c.getContext("2d");
    
    var temp_position = [];
    var temp_text = [];
    if(frames.length !== position.length || frames.length !== text.length)
    {
        for (let index = 0; index < frames.length; index++) 
        {
            temp_position.push([]);
            temp_text.push([]);
        }
        settext([...temp_text]);
        setposition([...temp_position]);
    }
    
    
    function clear ()
        {
            var temp_position = position;
            temp_position[currentFrame]=[];
            setposition([...position]);
            var temp_text = text;
            temp_text[currentFrame] =[];
            settext([...temp_text]);
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0,0,c.width,c.height);
            var image = new Image();
            image.src = frames[currentFrame];
            image.setAttribute("width", "1000");
            image.setAttribute("height", "600");
            setcount(1);
            image.onload = function(){
                ctx.drawImage(image, 0, 0,1000,600);
            }
            const myNode = document.getElementById("inputs");
            while (myNode.childElementCount !== 2 ) 
            {
                if(myNode.lastChild.id!=='clear' && myNode.lastChild.id!=='save')
                {
                    myNode.removeChild(myNode.lastChild);
                }
  }
        }

    function getMousePosition( event) {
        if(currentFrame===0)
        {
            alert("Select a Camera First");
        }
        else
        {
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            var canvas = document.getElementById("myCanvas");
            if(count <= 5)
            {
                let rect = canvas.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                position[currentFrame].push([x,y]);
                var c = document.getElementById("myCanvas");
                var ctx = c.getContext("2d");
                ctx.font = "60px sans-serif";
                ctx.fillStyle = "#1eff00";
                ctx.fillText(count.toString(), x-10, y+10);
                var inputs = document.getElementById("inputs")
                var input = document.createElement('input')
                input.setAttribute("id", count.toString());
                input.style = "width:100% ; height:50px"
                input.setAttribute("placeholder", count.toString());
                inputs.appendChild(input)
                setcount(count+1);
            }
            else{
                alert("Boss enough !!")
            }          
        }
        
	}
    const Analysis = ()=>
    {
        const myNode = document.getElementById("inputs");
        if(myNode.childElementCount !== 2)
        {
            text[parseInt(currentFrame)]=[];
        }
        for (let index = 0; index < position[currentFrame].length; index++) 
        {
            console.log(index,"index")
            if(document.getElementById((index+1).toString()) !== null)
            {
                var txt = document.getElementById((index+1).toString()).value;
                text[parseInt(currentFrame)].push(txt);
                console.log(txt,(index+1).toString(),parseInt(currentFrame),"parseInt(currentFrame)")
            }
            
        }
        var req ={"position":position,"frames":frames,"text":text};
        fetch('http://127.0.0.1:5000/analysis', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify(req)
            })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setrowData([...result])
                // console.log('Success:', persons)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        console.log(position,text,currentFrame);
    }
    const change = (e)=>
    {
        console.log(position[currentFrame],position[currentFrame].length,"saving...")
        const myNode = document.getElementById("inputs");
        if(myNode.childElementCount !== 2)
        {
            text[parseInt(currentFrame)]=[];
        }
        for (let index = 0; index < position[currentFrame].length; index++) 
        {
            console.log(index,"index")
            if(document.getElementById((index+1).toString()) !== null)
            {
                var txt = document.getElementById((index+1).toString()).value;
                text[parseInt(currentFrame)].push(txt);
                console.log(txt,(index+1).toString(),currentFrame,"currentFrame")
            }
            
        }
        
        while (myNode.childElementCount !== 2 ) 
        {
            if(myNode.lastChild.id!=='clear' && myNode.lastChild.id!=='save')
            {
                myNode.removeChild(myNode.lastChild);
            }
        }
        setcurrentFrame(e.target.value);
        console.log(e.target.value,text[e.target.value],text,"display")
        for (let index = 0; index < text[e.target.value].length; index++) {
            const element = text[e.target.value][index];
            var inputs = document.getElementById("inputs")
            var input = document.createElement('input')
            input.setAttribute("id", (index+1).toString());
            input.style = "width:100% ; height:50px"
            input.setAttribute("placeholder", (index+1).toString());
            input.defaultValue=element;
            inputs.appendChild(input)
            
        }
        
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0,0,c.width,c.height);
        var image = new Image();
        image.src = frames[e.target.value];
        
        image.setAttribute("width", "1000");
        image.setAttribute("height", "600");
        setcount(position[e.target.value].length+1);
        image.onload = ()=>
        {
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.drawImage(image, 0, 0,1000,600);
        
        console.log(position[e.target.value])
        for (let index = 0; index < position[e.target.value].length; index++) 
        {
            const element = position[e.target.value][index];
            var x =  element[0];
            var y =  element[1];
            ctx.font = "60px sans-serif";
            ctx.fillStyle = "#1eff00";
            ctx.fillText((index+1).toString(), x-10, y+10);
            console.log((index+1).toString(), x-10, y+10,"draw")
        }
        console.log(e.target.value,frames[e.target.value],"hihihihih");
        }
    }
    const back = ()=>{
        const myNode = document.getElementById("inputs");
        if(myNode.childElementCount !== 2)
        {
            text[parseInt(currentFrame)]=[];
        }
        for (let index = 0; index < position[currentFrame].length; index++) 
        {
            console.log(index,"index")
            if(document.getElementById((index+1).toString()) !== null)
            {
                var txt = document.getElementById((index+1).toString()).value;
                text[parseInt(currentFrame)].push(txt);
                console.log(txt,(index+1).toString())
            }
            
        }
        setoption(5);
        setloading(1);
        settoggle(0);
    }
    return (
    
    <div >
        <button style={{"position":"absolute","left":"5px","borderStyle": "solid","width":"20%","height":"5%","borderRadius":"7px","background":"#1eff00","border":"none"}} onClick={back}> BACK </button>
        <select style={{"position": "absolute","top":"10px", "right": "10%","width":"10%","height":"30px" }} defaultValue="" id="Camera" onChange={change}>
              <option value="" disabled selected >Select a Camera</option>
              {frames.map((item, index) => {
                return (
                  <option key={index} value={index}>
                    {"CAMERA "+(index+1)}
                  </option>
                );
              })}
            </select>
        <div id="inputs" style={{"position": "absolute","top":"40px", "right": "0px", "width":"20%" , "height":"600px" }}>
            <button id="clear" style={{"fontSize": "24px"}}  onClick={clear} >CLEAR</button>
            <button id="save" style={{"fontSize": "24px"}}  onClick={Analysis} >Start Analysis</button>
        </div>
        <div style={{"borderStyle":"solid","borderColor": "#1eff00","width":"1005px" ,"height":"605px","position": "absolute","top":"45px"}} >
            <canvas width="1000" height="600" id="myCanvas"  onMouseDown={(e)=>{getMousePosition(e);}} >
            </canvas>
        </div>
        <div style={{"top":"90%","width":"80%","height":"50%","position":"absolute","left":"10%","borderStyle":"solid","borderColor": "#1eff00"}} className="ag-theme-alpine">
        <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                onGridColumnsChanged={sizeToFit}
                >
        </AgGridReact>
        </div>
	    
    </div>)
}
export default Analysis;