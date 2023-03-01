const Header = ({ course }) => (
    <h2>{course.name}</h2>
)

const Part = ({ part, exercises }) => (
    <p>
        {part} {exercises}
    </p>
)

const Content = ({ parts }) => (
    <>
        {parts.map((part) => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
    </>
)

const Total = ({ parts }) => (
    <p style={{ fontWeight: 'bold' }}>total of {parts.reduce((a, b) => a + b.exercises, 0)} exercises</p>
)

const Course = ({ course }) => (
    <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

export default Course