import { useState, useRef } from "react";
import Image from "next/image";
import Analysis from "../components/Analysis.js"
import Tracking from "../components/Tracking.js"
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
function Form()
{
    const gridRef = useRef();
    const columnDefs =  [
        {field:"p",headerName:"Person ID", resizable: true , sortable: true,filter: true},
        {field:"c",headerName:"Camera", resizable: true , sortable: true,filter: true},
        {field:"x1",headerName:"X1", resizable: true , sortable: true,filter: true},
        {field:"x2",headerName:"X2",resizable: true , sortable: true,filter: true},
        {field:"y1",headerName:"Y1",resizable: true , sortable: true,filter: true},
        {field:"y2",headerName:"Y2",resizable: true , sortable: true,filter: true},
        {field:"time",headerName:"Time", resizable: true , sortable: true,filter: true},
        {field:"f",headerName:"Frame", resizable: true , sortable: true,filter: true},
    ]
    function sizeToFit() {
        gridRef.current.api.sizeColumnsToFit();
      }
    const [rowData,setrowData] = useState([]);
    var [toggle,settoggle] = useState(1) ;
    var [urls,seturls] = useState([]) ;
    var [persons,setpersons] = useState({'-1':[]}) ;
    var [Trackpersons,setTrackpersons] = useState([]) ;
    var [frames,setframes] = useState([]) ;
    var [option,setoption] = useState(0) ;
    var [loading,setloading] = useState(0) ;
    var [position,setposition] = useState([]) ;
    var [text,settext] = useState([]) ;
    const [Logs,setLogs] =useState(0) ;
    const [ModelView,setModelView] =useState(false) ;
    const [CurrentPerson,setCurrentPerson] =useState(-1) ;
    const addUrls = ()=>{
        if(urls.length !== 5)
        {
            seturls([...urls,""]);
        }
    }
    const removeUrls = ()=>
    {
        if(urls.length !== 0)
        {
            var temp = urls;
            temp.pop();
            seturls([...temp]);
        }
    }
    const refresh = ()=>{
        fetch('http://127.0.0.1:5000/gallery', {
            method: 'get',
            })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setpersons({...result})
                // console.log('Success:', persons)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const Start_Finding = () =>
    {
        var x = [];
        for (var i=0 ; i<urls.length;i++)
        {
            x.push(document.getElementById("input"+i).value);
        }
        seturls([...x]);
        var temp ={'x':x};
        fetch('http://127.0.0.1:5000/process', {
        method: 'POST',headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(temp)
        })
        .then((response) => {console.log(response,"response")})
        setoption(5);
    }
    const Start_Tracking = ()=> {
        setoption(0);
        settoggle(6);
    }
    const Start_Logs = ()=>{
        fetch('http://127.0.0.1:5000/logs', {
            method: 'post',
            })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setrowData(result)
                // console.log('Success:',t)
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        setLogs(1);
        setoption(0);
        settoggle(7);
        setloading(0);
    }
    const back = ()=>{
        setoption(5);
        setloading(1);
        settoggle(0);
    }
    const back2 = ()=>{
        setoption(5);
        setloading(1);
        settoggle(0);
        setLogs(0);
    }
    const Start_Analysis = () =>
    {
        if(document.getElementById("input"+i)!==undefined)
        {
            var x = [];
            for (var i=0 ; i<urls.length;i++)
            {
                x.push(document.getElementById("input"+i).value);
            }
            seturls([...x]);
        }
        var req ={"urls":x};
        fetch('http://127.0.0.1:5000/createFrames', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify(req)
            })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setframes([...result])
                // console.log('Success:', persons)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        settoggle(3); 
        setoption(0);
        setloading(0);
    }
    const Start_Tracking_person = (e)=>{
        fetch('http://127.0.0.1:5000/tracking', {
            method: 'post',headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({"pid":e.target.id,"places":[],"position":position,"frames":frames,"text":text})
            })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setTrackpersons(result);
                setCurrentPerson(e.target.id);
                setModelView(true);
                console.log(e.target.id);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const foo = (e) =>
    {
        e.target.innerText = "Track this Person"
        console.log(e.target.innerText); 
    }
    const foo2 = (e) =>
    {
        e.target.innerText = e.target.id
        // console.log(e.target.id); 
    }
    const Filter = (e) =>{
        var fil = document.getElementById("fileinput");
        console.log(document.getElementById("Camera"),"ss");
        var req = {'cam':document.getElementById("Camera").value ,
        'from':document.getElementById("From").value ,
        'to':document.getElementById("To").value ,
        'file':fil.value
    }
        fetch('http://127.0.0.1:5000/filter', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body:JSON.stringify(req)
            })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                // var new_results  = {}
                // if('-1' in result)
                // {
                //     var ord = result['-1'];
                //     for (var o = 0 ; o < ord.length ; o++)
                //     {
                //         new_results[ord[o]] = result[ord[o]]
                //     }
                //     console.log("innnn",new_results);
                //     setpersons({...new_results})
                // }
                // else{
                    setpersons({...result})
                // }
                // console.log('Success:', persons)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } 
    // const find_in_all_places =  (e) =>{
    //     Start_Tracking_person(e.target.id)
       
    // }
    const bar = (e)=>{
        console.log(e.target.id)
    }
    const bar2 = (e)=>{
        console.log(e.target.id)
    }
    const close_model = (e)=>{
        setModelView(false);
    }
    return(  
    <div >
        
        
{(toggle===1 ) &&
        <div style={{ "top":"70px", "width":"40%" , "position":"absolute" ,"left":"30%","borderStyle": "solid","borderColor":"#1eff00" ,"borderRadius":"5px"}}>
            
            <h1 style={{"textAlign":"center"}}>Video Urls</h1>
            <button style={{"width":"48%", "height":"40px","margin":"1%","borderRadius":"5px"}} onClick={addUrls} >Add New URLs</button>
            <button style={{"width":"48%", "height":"40px","margin":"1%","borderRadius":"5px"}} onClick={removeUrls} >Remove URL</button>
            {urls.map((x,i)=>{
                return(
                <input 
                key={i}
                id={"input"+i}
                style={{ "width":"98%" , "height":"40px" ,"margin":"5px","borderRadius":"5px" }}
                placeholder = {i+1}
                defaultValue="./data/video/u.mp4"
                >
                </input>
            )})} 
            <button style={{"width":"98%", "height":"40px","margin":"1%" , "background":"#1eff00","border":"none","borderRadius":"5px"}} onClick={Start_Finding}> Start Processing </button>
            
            {/* <button disabled style={{"width":"100%", "height":"40px","margin":"1%" , "background":"rgb(0, 255, 0)"}} onClick={Start_Analysis}> Find A person </button>
            <button disabled style={{"width":"100%", "height":"40px","margin":"1%" , "background":"rgb(0, 255, 0)"}} onClick={Start_Analysis}> Analysis </button>
            <button disabled style={{"width":"100%", "height":"40px","margin":"1%" , "background":"rgb(0, 255, 0)"}} onClick={Start_Analysis}> Logs </button> */}
            
            
        </div>
       
            
}
{
(option===5 ) &&
        <div>
        <div className="hvr-grow" style={{ "height":"200px", "width":"300px" ,"background":"black", "position":"absolute","bottom":"30px","left":"30px" ,"textAlign":"center","padding":"40px","borderRadius":"10%","fontFamily":"Verdana","fontSize":"50px","border":"5px","borderBlockColor":"#1eff00","borderBlockStyle":"solid","color":"white"}} onClick={Start_Tracking}>
        Track Person
        </div>
        <div className="hvr-grow" style={{ "height":"200px", "width":"300px" ,"background":"black", "position":"absolute","bottom":"30px","left":"40%","textAlign":"center","padding":"55px","borderRadius":"10%","fontFamily":"Verdana","fontSize":"50px","border":"5px","borderBlockColor":"#1eff00","borderBlockStyle":"solid","color":"white"}}onClick={Start_Analysis}>
        Analysis
        </div>
        <div className="hvr-grow" style={{ "height":"200px", "width":"300px" ,"background":"black", "position":"absolute","bottom":"30px","right":"30px","textAlign":"center","padding":"55px","borderRadius":"10%","fontFamily":"Verdana","fontSize":"50px","border":"5px","borderBlockColor":"#1eff00","borderBlockStyle":"solid","color":"white"}} onClick={Start_Logs} >
        Logs
        </div>
        </div>
}
{
loading===1 &&
    <div style={{"position":"absolute","top":"10%","left":"50%"}}>
    <div className="ring" >
        <span className=".ringSpam"></span>
    </div>
    <h5 style={{"fontSize":"8px","padding":"0px","margin":"0px"}}>Tracking</h5>
    </div>
}
{toggle===6 &&
     <div >
        <button style={{"position":"absolute","left":"5px","borderStyle": "solid","width":"20%","height":"5%","borderRadius":"7px","background":"#1eff00","border":"none"}} onClick={back}> BACK </button>
        <h1 style={{"textAlign":"center" , "margin":"0px","color":"#1eff00"}}>Find the Person</h1>
        <h4 style={{"textAlign":"center" , "margin":"0px"}}>You can filter Based on time and click on Person ID We will track the person in all Cameras</h4>
        <div style={{"padding":"5px","left":"0%","top":"15%","height":"5%","width":"100%","position":"absolute","borderStyle": "solid","borderColor":"#1eff00","borderWidth":"2px","borderRadius": "10px"}}>
            <div style={{"width":"100%","height":"100%"}}>
            <label>From:</label>
            <input   type="datetime-local" id="From" name="appt" defaultValue="2022-01-01T12:00"></input>
            <label>&nbsp;&nbsp;To:</label>
            <input  type="datetime-local" id="To" name="appt" defaultValue="2022-01-01T12:00"  ></input>
            &nbsp;&nbsp;Camera:
            <select defaultValue="" id="Camera" >
              <option value="" >Select a Camera</option>
              { 
              urls.map((item, index) => {
                return (
                  <option key={index} value={index}>
                    {(index+1)+")"+item}
                  </option>
                );
              })}
              { 
              ['Camera 1','Camera 2','Camera 3','Camera 4'].map((item, index) => {
                return (
                  <option key={index} value={index}>
                    {(index+1)+")"+item}
                  </option>
                );
              })}
            </select>
            &nbsp;&nbsp;Image Of Person:
            <input id="fileinput" type="file" style={{"width":"15%","height":"100%"}}></input>
            <button style={{"position":"absolute","right":"12%","borderStyle": "solid","width":"10%","height":"75%","borderRadius":"7px","background":"#1eff00","border":"none"}} onClick={Filter}> Filter </button>
            <button style={{"position":"absolute","right":"5px","borderStyle": "solid","width":"10%","height":"75%","borderRadius":"7px","background":"#1eff00","border":"none"}} onClick={refresh}> Search </button>
            </div>
        </div>
       {
        ModelView && 
            <div>
                <div id="out" onClick={close_model} style={{"position":"absolute","width":"100%","color":"blue","borderStyle": "solid","border":"2px","height":"200%","borderRadius":"20px","background":"black","zIndex":"5","opacity": "0.8"}}>
                    
                </div>
                <div id="in" onClick={bar2} style={{"top":"25%", "position":"fixed","width":"80%","borderStyle": "solid","height":"45%","left":"10%","borderRadius":"20px","background":"black","zIndex":"10","opacity": "1","padding":"10px","borderColor":"#1eff00"}}>
                        <button onClick={close_model} style={{"position":"absolute", "top":"10px","right":"10px"}}>Close</button>
                        <Tracking peronid={CurrentPerson} Trackpersons={Trackpersons} setTrackpersons={setTrackpersons} ></Tracking>
                </div>
            </div>
        }
        
    
    <div style={{"top":"20%", "position":"absolute","width":"100%","color":"#1eff00"}}>
        {
            persons['-1'].map((detail1, i) => {
                {console.log(detail1,persons[i],i," persons")}
                return(
            <div style={{"margin":"10px"}} key={i} >
                <div  >
                    <button id={"Person"+detail1} onMouseEnter={foo} onMouseLeave={foo2} style={{"fontSize":"15px","borderRadius":"10px","top":"0px","height":"25px", "width":"10%","display":"inline","border": "none","background":"#1eff00"}} onClick={Start_Tracking_person}>
                                    {"Person "+detail1}
                    </button>
                </div>
                <div style={{ "borderStyle": "solid","borderColor":"white","borderWidth":"3px","borderRadius": "10px","display": "flex" , "overflow-x": "scroll"}}>
                    
                    
                {
                    
                    
                    persons[detail1].map((detail, index) => {
                        // {console.log(persons[i][index]," Image")}
                        return(
                            
                            <div style={{"height":"150px", "width":"100px","display": "inline"}} key={index}>
                                
                                <Image
                                src={detail.slice(38,detail.length)}
                                alt={detail.slice(38,detail.length)}
                                width={100}
                                height={150}
                                style={{"z-index": "-1"}}
                            />
                                
                                {/* <img src={require(detail).default} /> */}
                                {/* <Image src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="BigCo Inc. logo"/> */}
                            </div>
                        )
                    }
                    
                    )
                    }   
                    
                </div>
                </div>
                )
                })
        }
    </div>
            </div>
}
{
    toggle===3 &&
    <Analysis frames={frames} option={option} setoption={setoption} toggle={toggle} settoggle={settoggle} loading={loading} setloading={setloading} text={text} position={position} settext={settext} setposition={setposition}/>
}
{
    Logs===1 && 
    <div>   
        <button style={{"position":"absolute","left":"5px","borderStyle": "solid","width":"20%","height":"5%","borderRadius":"7px","background":"#1eff00","border":"none"}} onClick={back2}> BACK </button>

    <div style={{"top":"10%","width":"80%","height":"50%","position":"absolute","left":"10%","borderStyle":"solid","borderColor": "#1eff00"}} className="ag-theme-alpine">
        <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                onGridColumnsChanged={sizeToFit}
                >
        </AgGridReact>
        </div>
    </div>
    
}
    </div>)
}
export default Form;