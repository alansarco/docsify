export default function StudentDasboardLoading() {
    return (
      <>
          {/* <div className="position-absolute" style={{ zIndex: 500, top: 0, left: 0, width: "100%", height:"100%", backgroundColor: "#eeeeee00", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{ width: "2rem", height: "2rem", borderWidth: "0.2rem" }} className="spinner-border text-primary" role="status">  
                      <span className="visually-hidden">Loading...</span>   
                </div>
          </div> */}
          <div className="position-absolute" style={{ zIndex: 10, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
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