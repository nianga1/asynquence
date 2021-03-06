// "first"
ASQ.extend("first",function __extend__(api,internals){
	return function __first__() {
		if (internals("seq_error") || internals("seq_aborted") ||
			arguments.length === 0
		) {
			return api;
		}

		function reset() {
			error_messages.length = 0;
		}

		function success(trigger,idx,args) {
			if (!finished) {
				finished = true;

				// first successful segment triggers
				// main sequence to proceed as success
				trigger(
					args.length > 1 ?
					ASQ.messages.apply(ø,args) :
					args[0]
				);

				reset();
			}
		}

		function failure(trigger,idx,args) {
			if (!finished &&
				!(idx in error_messages)
			) {
				completed++;
				error_messages[idx] =
					args.length > 1 ?
					ASQ.messages.apply(ø,args) :
					args[0]
				;

				// all segments complete without success?
				if (completed === fns.length) {
					finished = true;

					// send errors into main sequence
					error_messages.length = fns.length;
					trigger.fail.apply(ø,error_messages);

					reset();
				}
			}
		}

		var completed = 0, error_messages = [], finished = false, fns;

		fns = ARRAY_SLICE.call(arguments);

		wrapGate(api,fns,success,failure,reset);

		return api;
	};
});
