import { useState ,useRef} from "react";
import Image from "next/image";
function Tracking({peronid , Trackpersons,setTrackpersons})
{


    return(
    <div>
        {peronid}
        <div style={{"position":"absolute","width":"98%","height":"87%","top":"10%", "borderStyle": "solid","borderColor":"white","borderWidth":"1px","borderRadius": "10px","display": "flex" , "overflow-x": "scroll"}}>
    {
        Trackpersons.map((detail, index) => 
        {
            {console.log(detail," Image detail")}
            return( 
            <div key={index} style={{"width":"100%","display": "inline","top":"5%" ,"borderStyle": "","borderColor":"white","overflow-wrap": "break-word"}}>
                <div style={{"height":"220px", "width":"120px"}} >
                    <Image
                        src={detail["f"].slice(38,detail["f"].length)}
                        alt={detail["f"].slice(38,detail["f"].length)}
                        width={120}
                        height={220}
                        style={{}}
                    />         
                </div>
                <h5 style={{"margin":"2px"}}>
                {"Camera-"+detail['c'] }
                </h5>
                <h5 style={{"margin":"2px"}}>
                {"Time-"+detail['time'] }
                </h5>
                <h5 style={{"margin":"2px"}}>
                {"Date-"+detail['date'] }
                </h5>
                <h5 style={{"margin":"2px"}}>
                {"Location-"+detail['place'] }
                </h5>
            </div>
            
        )})
    }
        </div>
        
    </div>)
}
export default Tracking;