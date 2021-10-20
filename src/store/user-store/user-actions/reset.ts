export function reset(self) {
  self.code = ''
  self.alias = ''
  self.myid = 0
  self.publicKey = ''
  self.currentIP = ''
  self.authToken = ''
  self.deviceId = ''
  self.onboardStep = 0
  self.invite = {
    inviterNickname: '',
    inviterPubkey: '',
    welcomeMessage: '',
    action: '',
  }
}
