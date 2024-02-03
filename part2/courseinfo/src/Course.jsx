const Header = ({ name }) => <h2>{name}</h2>

const Total = ({ parts }) => {
    const exerciseSum = parts.reduce((accumulator, currentValue) =>
        accumulator + currentValue.exercises, 0)
    return (
        <p><b>total of {exerciseSum} exercises</b></p>
    )
}

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}


const Content = ({parts}) => {
    return (
        parts.map(part => <Part key={part.id} part={part} />)
    )
}

const Course = ({course}) => {
    const name = course.name
    const parts = course.parts
    console.log('Name is ', name)
    console.log('Parts is ', parts)

    return (
        <>
            <Header name={name}/>
            <Content parts={parts}/>
            <Total parts={parts}/>
        </>
    )
}

export default Course