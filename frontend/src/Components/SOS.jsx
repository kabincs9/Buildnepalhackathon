const SOSCard = ({
    icon,
    title,
    number
}) => {


return (

<div className="sos-card">


<div className="sos-icon">

{icon}

</div>



<h3>

{title}

</h3>



<a

href={`tel:${number}`}

>

Call {number}

</a>



</div>

);


};


export default SOSCard;