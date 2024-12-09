export default function MainLoading() {
      return (
        <>
            <div className="position-fixed bg-white bg-gardient " style={{ zIndex: 9999, top: 0, left: 0, width: "100%", height:"100%",  display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <div className="spinner-grow-first text-info mx-1" role="status">  
                        <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="spinner-grow text-warning mx-1" role="status">  
                        <span className="visually-hidden">Loading...</span>   
                  </div>
                  <div className="spinner-grow-third text-danger mx-1" role="status">  
                        <span className="visually-hidden">Loading...</span>   
                  </div>
            </div>
        </>    
      );
}