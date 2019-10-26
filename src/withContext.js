import React from 'react'
export default Context => WrappedComponent => {
  class Connected extends React.PureComponent {
    render() {
      return (
        <Context.Consumer>
          {context => <WrappedComponent {...this.props} __context={context} />}
        </Context.Consumer>
      );
    }
  }

  Connected.WrappedComponent = WrappedComponent;
  const wrappedCompName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  const consumerName =
    Context.Consumer.displayName || Context.Consumer.name || "ContextConsumer";
  Connected.displayName = `${wrappedCompName}(${consumerName})`;

  return Connected;
};