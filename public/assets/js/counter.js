class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    increment = () => {
        this.setState({ count: this.state.count + 1 });
    }

    render() {
        return (
            <div>
                <p>Count: {this.state.count}</p>
                <button className="btn btn-sm btn-primary" onClick={this.increment}>
                    <i className="bi bi-plus"></i>
                    Increment
                </button>
            </div>
        );
    }
}
