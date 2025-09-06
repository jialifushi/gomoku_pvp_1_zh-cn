const React = require('react');

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      password: '',
      error: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleChange(e) {
    this.setState({ password: e.target.value });
  }

  _handleSubmit(e) {
    e.preventDefault();
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: this.state.password }),
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('访问码错误');
      }
    })
    .then(data => {
      if (data.success) {
        this.props.onLoginSuccess();
      } else {
        this.setState({ error: '访问码错误', password: '' });
      }
    })
    .catch(err => {
      this.setState({ error: err.message, password: '' });
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>五子棋来放松一下</h2>
        <form onSubmit={this._handleSubmit} style={{ marginTop: '20px' }}>
          <input
            type="password"
            value={this.state.password}
            onChange={this._handleChange}
            placeholder="请输入访问码"
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
            进入
          </button>
        </form>
        {this.state.error && <p style={{ color: 'red', marginTop: '10px' }}>{this.state.error}</p>}
      </div>
    );
  }
}

module.exports = LoginPage;
