const Parrafo = ({text,claseAdd,textAdicional}) => {
  return (
    <p className={claseAdd}>{textAdicional}
      <span>{text ? text.toUpperCase() : ""}</span>
    </p>
  )
}

export default Parrafo