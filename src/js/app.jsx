import React from 'react';
import { RaisedButton, TextField, Paper } from 'material-ui';

import parse from './ook.js';

const entryPoint = document.getElementById( 'entry-point' );

class App extends React.Component
{
    constructor( props )
    {
        super( props );
        this.state =
        {
            code: '',
            input: '',
            result: '',
            errors: {}
        };
    }

    handleChange( name, event )
    {
        this.setState( { [name]: event.target.value, errors: {} } );
    }

    interprete()
    {
        event.preventDefault();

        const code = this.state.code;
        const input = this.state.input;

        if ( !code )
        {
            this.setState(
            {
                errors:
                {
                    code: 'Ook Ook code is required.',
                    input: '' //'Something was wrong'
                }
            } );
            return;
        }

        let result;
        try
        {
            result = parse( code, input );
        }
        catch ( err )
        {
            result = err.message;
        }

        this.setState( { result } );

    }

    render()
    {
        return (
            <section className='section--ook'>
                <form className='section--ook--form'>
                    <h3 className='section--ook--form--title'>Ook Ook Interpreter</h3>
                    <TextField
                        className='section--ook--form--input'
                        hintText='Code to be interpreted'
                        floatingLabelText='Code to be interpreted'
                        value={this.state.code}
                        onChange={this.handleChange.bind( this, 'code' )}
                        errorText={this.state.errors.code}
                    />
                    <TextField
                        className='section--ook--form--input'
                        hintText='Optional Input'
                        floatingLabelText='Optional Input'
                        value={this.state.input}
                        onChange={this.handleChange.bind( this, 'input' )}
                        errorText={this.state.errors.input}
                    />
                    <Paper
                        className='section--ook--form--result'
                        zDepth={1}
                    >
                      <p>{this.state.result}</p>
                    </Paper>
                    <RaisedButton
                        className='section--ook--form--button'
                        label='Ook Ook!'
                        primary={true}
                        onClick={this.interprete.bind( this )}
                    />
                </form>
            </section>
        );
    }
}

React.render( <App/>, entryPoint );
