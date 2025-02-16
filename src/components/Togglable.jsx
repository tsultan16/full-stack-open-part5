import { useState, useEffect } from 'react';

const Togglable = (props) => {
    const [visible, setVisible] = useState(false);

    // expose setVisible method to parent using the ref prop
    useEffect(() => {
        if(props.refProp) {
            props.refProp({ setVisible: (value) => setVisible(value) })
        }

    }, [props.refProp]);

    const hideWhenVisible = { display: visible ? 'none' : ''};
    const showWhenVisible = { display: visible ? '' : 'none'};
    
    const toggleVisibility = () => {
        setVisible(!visible);
        console.log('toggled');
    }


    return (
        <div>
            <div style={hideWhenVisible} >
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>

        </div>
    );
}

export default Togglable;

