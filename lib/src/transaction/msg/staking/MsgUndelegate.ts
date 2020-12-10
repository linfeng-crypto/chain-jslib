import ow from 'ow';
import { SignModeDirectMsg } from '../../../cosmos/v1beta1/types/msg';
import { Message } from '../Message';
import { owMsgUndelegateOptions } from '../ow.types';
import { InitConfigurations } from '../../../core/cro';
import { validateAddress, AddressType } from '../../../utils/address';
import { ICoin } from '../../../coin/coin';
import { COSMOS_MSG_TYPEURL } from '../../common/constants/typeurl';

export const msgUndelegate = function (config: InitConfigurations) {
    return class MsgUndelegate implements Message {
        /** MsgUndelegate delegatorAddress. */
        public delegatorAddress: string;

        /** MsgUndelegate validatorAddress. */
        public validatorAddress: string;

        /** MsgUndelegate amount. */
        public amount: ICoin;

        /**
         * Constructor to create a new MsgSend
         * @param {IMsgUndelegate} options
         * @returns {MsgUndelegate}
         * @throws {Error} when options is invalid
         */
        constructor(options: IMsgUndelegate) {
            ow(options, 'options', owMsgUndelegateOptions);
            this.delegatorAddress = options.delegatorAddress;
            this.validatorAddress = options.validatorAddress;
            this.amount = options.amount;
            this.validateAddresses();
        }

        /**
         * Returns the raw Msg representation of MsgUndelegate
         * @returns {SignModeDirectMsg}
         */
        toRawMsg(): SignModeDirectMsg {
            const cosmosCoin = this.amount.toCosmosCoin();
            return {
                typeUrl: COSMOS_MSG_TYPEURL.MsgUndelegate,
                value: {
                    delegatorAddress: this.delegatorAddress,
                    validatorAddress: this.validatorAddress,
                    amount: {
                        denom: cosmosCoin.denom,
                        amount: cosmosCoin.amount,
                    },
                },
            };
        }

        /**
         * Validates the user provided addresses
         * @returns {void}
         */
        validateAddresses(): void {
            const { network } = config;

            if (!validateAddress({ network, address: this.validatorAddress, type: AddressType.VALIDATOR })) {
                throw new TypeError('Provided `validatorAddress` doesnt match network selected');
            }

            if (!validateAddress({ network, address: this.delegatorAddress, type: AddressType.USER })) {
                throw new TypeError('Provided `delegatorAddress` doesnt match network selected');
            }
        }
    };
};

export type IMsgUndelegate = {
    delegatorAddress: string;
    validatorAddress: string;
    amount: ICoin;
};
