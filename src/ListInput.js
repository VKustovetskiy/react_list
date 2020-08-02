import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    marginRight: 'auto'
  }
});

class ListInput extends React.Component {
  state = {
    readOnly: true,
    value: this.props.value
  };

  handleDoubleClick = () => {
    this.setState(({ readOnly }) => ({ readOnly: !readOnly }))
  };

  handleChange = e => {
    const newVal = e.target.value

    this.setState(() => ({
      value: newVal
    }))
  }

  handleBlur = e => {
    const { rowId, handleInputChange } = this.props
    const newVal = e.target.value

    if (!this.state.readOnly) {
      handleInputChange(rowId, newVal)
      this.setState(({ readOnly }) => ({ readOnly: !readOnly }))
    }
  }

  render() {
    const { readOnly, value } = this.state
    const { classes } = this.props;

    return (
      <InputBase
        value={value}
        readOnly={readOnly}
        onDoubleClick={this.handleDoubleClick}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        className={classes.root}
        fullWidth />
    )
  }
}

export default withStyles(styles)(ListInput)
