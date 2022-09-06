import Theme from '../Utils/Theme';
import colors from './colors';

const palette = {
  wrapMainView: {
    flex: 1,
    backgroundColor: Theme.white,
    justifyContent: Theme.spaceBetween,
  },
  wrapMainViewBGWhite: {
    flex: 1,
    backgroundColor: Theme.white,
    justifyContent: Theme.spaceBetween,
  },
  heading: {
    color: colors.title,
    fontSize: 20,
    textAlign: 'center',
  },
  text: {
    color: colors.text,
    fontSize: 17,
    textAlign: 'center',
  },
  gradientBtnDefaultStyles: {
    width: Theme.wp('70%'),
    height: Theme.hp('9%'),
    borderRadius: 10,
    justifyContent: Theme.align,
    alignItems: Theme.align,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  btnTxtStyles: {
    color: Theme.primary,
    fontFamily: Theme.Roboto,
    fontSize: Theme.txtMedium1,
    margin: 2,
    textAlign: Theme.align,
  },
  launchImg: {
    justifyContent: Theme.align,
    alignItems: Theme.align,
    alignSelf: Theme.align,
    marginBottom: 25,
    marginTop: 25,
  },

  headTxtLogin: {
    color: Theme.txtBlue,
    fontFamily: Theme.Roboto,
    fontSize: Theme.txtMedium25,
  },
  headTxtRegister: {
    color: Theme.txtBlue,
    fontFamily: Theme.Roboto,
    fontSize: Theme.txtMedium25,
  },
};

export default palette;
