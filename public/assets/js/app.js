const App = () => {
    return (
        <div>
            <Hello name="Alice" />
            <Hello name="Bob" />
            <Counter />
        </div>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('root')
);