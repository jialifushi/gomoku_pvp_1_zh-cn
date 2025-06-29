import React, {Component} from 'react'
import GameBoard from './GameBoard'
import GameLobby from './GameLobby'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.setGameID = this.setGameID.bind(this)
    this.state = {
      isLobby: true,
      gameID: null,
      player: 0
    }
  }

  componentDidMount() {
    socket.on('player ready', data => this.setLobby(data))
    socket.on('player won', data => this.win(data))
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
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-offset-2 col-md-8">
            <div className="gameBoard">
              <div className='title' style={this.titleColor()}>联机五子棋</div>
              <p style={{textAlign: 'center'}}>一个玩家先创建房间，另一个玩家在加入房间；加入房间的玩家先手。</p>
              <p style={{textAlign: 'center'}}><a href="https://github.com/ChrisWiles/GomokuReact" target="_blank">原项目仓库</a> <a href="https://github.com/Firfr/gomoku_pvp_1_zh-cn" target="_blank">镜像制作仓库</a></p>
              {this.changeLobby(this.state.isLobby)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
