const testLayout = ({
    children
}:{
    children: React.ReactNode
}) =>{
    return(
        <div className="h-full">
            <div>
                This is a navBar
            </div>
            <hr/>
            {children}
        </div>
    )
}

export default testLayout;