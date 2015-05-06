const debug = false;
let ptr = 0;

const ops =
{
    'Ook. Ook.': ( _, data ) =>
    {
      data[ptr] = data[ptr] || 0;
      data[ptr] += 1;

      if ( debug )
      {
          console.log('Ook. Ook.', data[ptr], ptr);
      }
    },

    'Ook! Ook!': ( _, data ) =>
    {
      data[ptr] = data[ptr] || 0;
      data[ptr] -= 1;

      if ( debug )
      {
          console.log('Ook! Ook!', data[ptr], ptr);
      }
    },

    'Ook? Ook.': () =>
    {
      ptr -= 1;

      if ( ptr < 0 )
      {
          ptr = 0;
      }

      if ( debug )
      {
          console.log('Ook? Ook.', ptr);
      }
    },

    'Ook. Ook?': () =>
    {
      ptr += 1;

      if ( debug )
      {
          console.log('Ook. Ook?', ptr);
      }
    },

    'Ook! Ook.': ( _, data, output ) =>
    {
      const c = String.fromCharCode(data[ptr]);
      output.push( c );

      if ( debug )
      {
          console.log('Ook! Ook.', c, data[ptr]);
      }
    },

    'Ook. Ook!': ( input, data ) =>
    {
      const c = input.shift();

      if ( typeof c === "string" )
      {
          data[ptr] = c.charCodeAt(0);
      }
      if ( debug )
      {
          console.log('Ook. Ook!', c, data[ptr]);
      }
    }
};


const program = ( nodes, inputString ) =>
{
    let output = [];
    let data = [];

    const input = inputString && inputString.split( '' ) || [];

    nodes.forEach( ( node ) =>
    {
        node( input, data, output );
    } );

    return output.join('');
};


const loop = ( nodes ) =>
{
    return ( input, data, output ) =>
    {
      let loopCounter = 0;

      while( data[ptr] > 0 )
      {
        if ( loopCounter++ > 10000 )
        {
            throw new Error( "Infinite loop detected" );
        }

        nodes.forEach( ( node ) =>
        {
            node( input, data, output );
        } );
      }
    };
};


const parseLoop = ( programOps ) =>
{
    let nodes = [];
    let nextOp;

    while ( programOps[0] !== 'Ook? Ook!' )
    {
        nextOp = programOps.shift();

        if ( nextOp === undefined )
        {
            throw new Error( "Missing closing bracket" );
        }
        else if ( ops[nextOp] )
        {
            nodes.push( ops[nextOp] );
        }
        else if ( nextOp === 'Ook! Ook?' )
        {
            nodes.push( parseLoop( programOps ) );
        }
    }

    programOps.shift(); //discard ']'

    return loop( nodes );
};

const parseProgram = ( programOps, input ) =>
{
    let nodes = [];
    let nextOp;

    while ( programOps.length > 0 )
    {
        nextOp = programOps.shift();

        if ( ops[nextOp] )
        {
            nodes.push( ops[nextOp] );
        }
        else if ( nextOp === 'Ook! Ook?' )
        {
            nodes.push( parseLoop( programOps ) );
        }
        else if ( nextOp === 'Ook? Ook!' )
        {
            throw new Error( "Missing opening bracket" );
        }
    }

    return program( nodes, input );
};

const splitByOps = ( input ) =>
{
    let split = [];
    let i = 0;

    while ( i < input.length )
    {
        split.push( input.slice( i, i+9 ) );
        i += 10;
    }

    return split;
};

export default ( code, input ) =>
{
    const programOps = splitByOps( code );
    return parseProgram( programOps, input );
};
