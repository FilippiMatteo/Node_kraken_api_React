import React from 'react';



class Test extends React.Component {
  constructor(props) {
    super(props);
    this.x = this._get();
    this.state = {
      value: null,
    };
  }

  _get() {
    (async () => {
      try{
        const rawResponse = await fetch('http://127.0.0.1:5555/kraken/test', {
          method: 'GET',
          mode: "no-cors",
          headers: {
            'Access-Control-Allow-Origin':'*',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // body: JSON.stringify({a: 1, b: 'Textual content'})
        });
        const content = await rawResponse.json();

        console.log(content);
      }catch(err){
        console.log(err)
      }

    })();

  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}

export default Test;
