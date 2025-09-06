import React, {Component} from 'react'
import GameBoard from './GameBoard'
import GameLobby from './GameLobby'
import LoginPage from './LoginPage' // 引入登录页面

export default class App extends Component {
  constructor(props) {
    super(props)
    this.setGameID = this.setGameID.bind(this)
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this); // 绑定登录成功函数
    this.state = {
      isLobby: true,
      gameID: null,
      player: 0,
      isLoggedIn: false, // 增加登录状态
      passwordProtected: true, // 假设需要密码，稍后会从服务器确认
    }
  }

  componentDidMount() {
    // 从服务器检查是否需要密码
    fetch('/status')
      .then(res => res.json())
      .then(status => {
        if (!status.passwordProtected) {
          // 如果不需要密码，直接设置为已登录
          this.setState({ isLoggedIn: true, passwordProtected: false });
        } else {
          // 如果需要密码，检查 sessionStorage
          if (sessionStorage.getItem('isLoggedIn') === 'true') {
            this.setState({ isLoggedIn: true });
          }
          this.setState({ passwordProtected: true });
        }
      })
      .catch(err => {
        // 如果后端接口不通，默认需要密码
        console.error('Cannot fetch login status', err);
        this.setState({ passwordProtected: true });
      });

    socket.on('player ready', data => this.setLobby(data))
    socket.on('player won', data => this.win(data))
  }

  // 登录成功后的回调函数
  handleLoginSuccess() {
    sessionStorage.setItem('isLoggedIn', 'true');
    this.setState({ isLoggedIn: true });
  }

  win(data) {
    if (data.gameID === this.state.gameID) {
      if (this.state.player === +data.player) {
        alert('你赢了(刷新页面在来一局)')
      } else {
        alert('你输了(刷新页面在来一局)')
      }
    }
  }

  setGameID(id, player) {
    this.setState({gameID: id})

    if (player === 'guest') {
      this.setState({player: 1})
      socket.emit('player ready', {gameID: id})
    } else {
      this.setState({player: 2})
    }
  }

  setLobby(data) {
    if (data.gameID === this.state.gameID) {
      this.setState({
        isLobby: !this.state.isLobby
      })
    }
  }

  titleColor() {
    const player = this.state.player
    if (player === 1)
      return {color: '#375A7F'}
    if (player === 2)
      return {color: '#00BC8C'}
    if (player === 0)
      return {color: 'white'}
    }

  changeLobby(lobby) {
    const {gameID, player} = this.state
    if(lobby) {
      return <GameLobby setGameID={this.setGameID}/>
    } else {
      return <GameBoard gameID={gameID} player={player}/>
    }
  }

  render() {
    // 如果需要密码且未登录，显示登录页面
    if (this.state.passwordProtected && !this.state.isLoggedIn) {
      return <LoginPage onLoginSuccess={this.handleLoginSuccess} />;
    }

    // 登录后显示正常的游戏内容
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-offset-2 col-md-8">
            <div className="gameBoard">
              <div className='title' style={this.titleColor()}>联机五子棋</div>
              <p style={{textAlign: 'center'}}>一个玩家先创建房间，另一个玩家在加入房间；加入房间的玩家先手。</p>
              <p style={{textAlign: 'center'}}><a href="http://121.4.81.141" target="_blank">边听边看</a> <a href="https://music..xyz" target="_blank">边学边玩</a></p>
              {this.changeLobby(this.state.isLobby)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
