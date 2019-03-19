import React from 'react';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/session.actions';

class CreateLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newSessionId: '',
            currentUser: { name: '' }
        };

        this.copySessionId = this.copySessionId.bind(this);
        this.joinLobby = this.joinLobby.bind(this);
        this.changeCurrentUser = this.changeCurrentUser.bind(this);
    }

    componentDidMount() {
        this.props.firebase
            .addSession()
            .then(docRef => this.setState({ newSessionId: docRef.id }))
            .catch(err => console.error(err));
    }

    copySessionId(e) {
        const selectText = element => {
            let doc = document,
                textEl = element,
                range,
                selection;
            if (doc.body.createTextRange) {
                //ms
                range = doc.body.createTextRange();
                range.moveToElementText(textEl);
                range.select();
            } else if (window.getSelection) {
                //all others
                selection = window.getSelection();
                range = doc.createRange();
                range.selectNodeContents(textEl);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };

        e.preventDefault();
        const sessionIdEl = document.getElementById('new-session-id');
        selectText(sessionIdEl);
        document.execCommand('copy');
    }

    joinLobby(e) {
        e.preventDefault();
        this.props.firebase
            .updateSession(this.state.newSessionId, {
                admin: this.state.currentUser,
                stage: 0
            })
            .then(() => {
                this.props.dispatch(setCurrentUser(this.state.currentUser));
                this.props.history.push(`/lobby/${this.state.newSessionId}`);
            });
    }

    changeCurrentUser(e) {
        this.setState({ currentUser: { name: e.target.value } });
    }

    render() {
        return (
            <div>
                <div>
                    <div id="new-session-id">{this.state.newSessionId}</div>
                    <div>
                        <button onClick={this.copySessionId}>Copy</button>
                    </div>
                </div>
                <div>
                    <input onChange={this.changeCurrentUser} />
                    <div>
                        <button onClick={this.joinLobby}>Join</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(CreateLayout);
