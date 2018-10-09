import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import 'brace/theme/github';
import './App.css';

let pyodide;
const jsnx = window.jsnx;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: 'Loading...',
			editorValue: 'from js import graph\n'
		}

		this.handleChange = this.handleChange.bind(this);
		this.runCode = this.runCode.bind(this);
		this.setGraphRef = this.setGraphRef.bind(this);
	}

	componentDidMount() {	
		window.languagePluginLoader.then(() => {
			console.log('pyodide loaded')
			pyodide = window.pyodide;
			console.log('Python runtime test: ' + pyodide.runPython('import sys\nsys.version'));
			this.setState({ loading: false });
		}).catch((e) => {
			this.setState({ loading: 'Failed to load. Please try again later.'});
		});
	}

	render() {
		const { loading, editorValue } = this.state;

		if (loading) {
			return <div>{ loading }</div>
		}

		return (
			<div className='App'>
				<div className='pane'>
					<div className='editor'>
						<AceEditor
							mode='python'
							theme='github'
							width='100%'
							height='100%'
							value={ editorValue }
							onChange={ this.handleChange }
						/>
					</div>
					<button onClick={ this.runCode }>Run</button>
				</div>
				<div className='pane'>
					<div
						className='graph'
						ref={ this.setGraphRef } 
					/>
					<div className='console' />
				</div>
			</div>
		);
	}

	handleChange(v, e) {
		this.setState({ editorValue: v });
	}

	runCode() {
		pyodide.runPython(this.state.editorValue);
	}

	setGraphRef(element) {
		window.graph = new jsnx.Graph();;
		jsnx.draw(window.graph, {
			element,
			withLabels: true
		}, true);
	}
}

export default App;
